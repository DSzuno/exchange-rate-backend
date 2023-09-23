import axios from "axios";
import { ProviderError } from "./errors/provider.error.js";

export class ExchangeRateProvider {
  #accessKey;
  #providerBaseUrl;

  /**
   *
   * @param accessKey
   * @param apiUrl
   */
  constructor({ accessKey, apiUrl }) {
    this.#accessKey = accessKey;
    this.#providerBaseUrl = apiUrl;
  }

  /**
   *
   * @returns {Promise<axios.AxiosResponse<any>>}
   */
  async getSupportedSymbols() {
    return await axios
      .get(`${this.#providerBaseUrl}/v1/symbols?access_key=${this.#accessKey}`)
      .then((res) => {
        return res.data.symbols;
      })
      .catch((e) => {
        throw new ProviderError(e.code);
      });
  }

  /**
   *
   * @param baseSymbol
   * @returns {Promise<axios.AxiosResponse<any>>}
   */
  async getExchangeRatesFor(baseSymbol) {
    return await axios
      .get(
        `${this.#providerBaseUrl}/v1/latest?access_key=${
          this.#accessKey
        }&base=${baseSymbol}`,
      )
      .then((res) => {
        return res.data.rates;
      })
      .catch((e) => {
        throw new ProviderError(e.code);
      });
  }
}
