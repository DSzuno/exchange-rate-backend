import { createClient } from "redis";

export class ExchangeRateRepository {
  #supportedSymbols = new Set();
  #prefix;
  #redisClient;
  #redisSetExpiration;

  /**
   *
   * @param host
   * @param port
   * @param updateFrequency
   * @param prefix
   * @param redisClient
   */
  constructor({
    host,
    port,
    updateFrequency = undefined,
    prefix = "",
    redisClient = undefined,
  }) {
    this.#redisSetExpiration = updateFrequency;
    this.#prefix = prefix;
    if (redisClient !== undefined) {
      this.#redisClient = redisClient;
    } else {
      this.#redisClient = createClient({ url: `redis://${host}:${port}` });
      this.#redisClient.on("error", (error) =>
        console.error(`Error : ${error}`),
      );
      this.#redisClient.connect();
    }
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async tearDown() {
    await this.#redisClient.disconnect();
  }

  /**
   *
   * @param baseSymbol
   * @returns {Promise<*>}
   */
  async getExchangeRatesFor(baseSymbol) {
    return JSON.parse(
      await this.#redisClient.get(`${this.#prefix}:rate:${baseSymbol}`),
    );
  }

  /**
   *
   * @param baseSymbol
   * @param rates
   * @returns {Promise<*>}
   */
  async saveExchangeRatesFor(baseSymbol, rates) {
    const setOptions = {};
    if (
      this.#redisSetExpiration !== undefined &&
      typeof this.#redisSetExpiration === "number"
    ) {
      setOptions.EX = this.#redisSetExpiration;
    }

    return await this.#redisClient.set(
      `${this.#prefix}:rate:${baseSymbol}`,
      JSON.stringify(rates),
      setOptions,
    );
  }

  /**
   *
   * @param symbols
   * @returns {Promise<Set<any>>}
   */
  async saveSupportedSymbols(symbols) {
    for (const symbol of symbols) {
      this.#supportedSymbols.add(symbol);
    }

    return this.#supportedSymbols;
  }

  /**
   *
   * @returns {Promise<Set<string>|undefined>}
   */
  async getSupportedSymbols() {
    if (this.#supportedSymbols.size === 0) {
      return undefined;
    }
    return this.#supportedSymbols;
  }
}
