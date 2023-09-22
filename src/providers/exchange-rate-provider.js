export class ExchangeRateProvider {
  #accessKey;
  #providerBaseUrl = "https://api.exchangeratesapi.io";
  constructor() {
    this.#accessKey = process.env.EXCHANGE_RATE_ACCESS_KEY || "";
  }

  async getSupportedSymbols() {
    return ["USD"];
  }

  async getExchangeRatesFor(baseSymbol) {
    return [USD];
  }
}
