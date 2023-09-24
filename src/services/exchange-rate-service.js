import { SymbolNotFoundError } from "./errors/symbol-not-found.error.js";

export class ExchangeRateService {
  /**
   * @var {ExchangeRateProvider}
   */
  #rateProvider;

  /**
   * @var {ExchangeRateRepository}
   */
  #rateRepository;

  /**
   *
   * @param {ExchangeRateProvider} rateProvider
   * @param {ExchangeRateRepository} rateRepository
   */
  constructor(rateProvider, rateRepository) {
    this.#rateProvider = rateProvider;
    this.#rateRepository = rateRepository;
  }

  /**
   *
   * @param symbol
   * @returns {Promise<*>}
   */
  async getExchangeRate(symbol) {
    if (await this.#isSymbolSupported(symbol)) {
      let rates = await this.#rateRepository.getExchangeRatesFor(symbol);
      if (rates === null) {
        rates = await this.#rateProvider.getExchangeRatesFor(symbol);
        await this.#rateRepository.saveExchangeRatesFor(symbol, rates);
      }

      return rates;
    }
    throw new SymbolNotFoundError(symbol);
  }

  /**
   *
   * @param symbol
   * @returns {Promise<boolean>}
   */
  async #isSymbolSupported(symbol) {
    let supportedSymbols = await this.#rateRepository.getSupportedSymbols();
    if (supportedSymbols === undefined) {
      supportedSymbols = await this.#rateProvider.getSupportedSymbols();
      if (supportedSymbols === undefined) {
        return;
      }
      supportedSymbols =
        await this.#rateRepository.saveSupportedSymbols(supportedSymbols);
    }
    return supportedSymbols.has(symbol);
  }
}
