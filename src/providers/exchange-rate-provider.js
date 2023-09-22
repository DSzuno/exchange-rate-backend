import axios from "axios";

export class ExchangeRateProvider {
  #accessKey;
  #providerBaseUrl = "https://api.exchangeratesapi.io";
  constructor() {
    this.#accessKey = process.env.EXCHANGE_RATE_ACCESS_KEY || "";
  }

  async getSupportedSymbols() {
    return await axios
      .get(`${this.#providerBaseUrl}/v1/symbols?access_key=${this.#accessKey}`)
      .then((res) => {
        return res.data.symbols;
      })
      .catch((e) => {});
  }

  async getExchangeRatesFor(baseSymbol) {
    return await axios
      .get(
        `${this.#providerBaseUrl}/v1/symbols?access_key=${
          this.#accessKey
        }&base=${baseSymbol}`,
      )
      .then((res) => {
        return res.data.rates;
      })
      .catch((e) => {});
  }
}
