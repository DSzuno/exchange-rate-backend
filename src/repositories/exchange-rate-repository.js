export class ExchangeRateRepository {
  #supportedSymbols = new Set();

  async getExchangeRatesFor(baseSymbol) {}

  /**
   *
   * @param baseSymbol
   * @param rates
   * @returns {Promise<undefined|object>>}
   */
  async saveExchangeRatesFor(baseSymbol, rates) {}

  async saveSupportedSymbols(symbols) {
    for (const symbol of symbols) {
      this.#supportedSymbols.add(symbol);
    }
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
