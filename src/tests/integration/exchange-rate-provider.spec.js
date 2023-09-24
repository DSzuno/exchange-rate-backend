import { expect } from "chai";
import { ExchangeRateProvider } from "../../providers/exchange-rate-provider.js";
import nock from "nock";
import { ProviderError } from "../../providers/errors/provider.error.js";

describe("Exchange rate provider INTEGRATION", () => {
  let provider;
  const accessKey = "testKey";
  const apiUrl = "https://api.test.io";

  beforeEach(() => {
    nock.cleanAll();
    provider = new ExchangeRateProvider({ accessKey, apiUrl });
  });

  context("getSupportedSymbols", () => {
    it("Should throw error when response status is other than 200", async () => {
      nock(apiUrl)
        .get("/v1/symbols")
        .query({ access_key: accessKey })
        .reply(500, "Internal server error");

      await expect(
        provider.getSupportedSymbols(),
      ).to.be.eventually.rejectedWith(
        ProviderError,
        `Provider not handled the request with following code: [ERR_BAD_RESPONSE]`,
      );
    });

    it("Should get back object of symbols on response status of 200", async () => {
      const responseMock = {
        success: true,
        symbols: {
          AED: "United Arab Emirates Dirham",
          AFN: "Afghan Afghani",
          ALL: "Albanian Lek",
          AMD: "Armenian Dram",
        },
      };
      nock(apiUrl)
        .get("/v1/symbols")
        .query({ access_key: accessKey })
        .reply(200, responseMock);

      const response = await provider.getSupportedSymbols();

      expect(response).to.be.eql(Object.keys(responseMock.symbols));
    });
  });

  context("getExchangeRatesFor", () => {
    const baseSymbol = "USD";
    it("Should throw error when response status is other than 200", async () => {
      nock(apiUrl)
        .get(`/v1/latest`)
        .query({ access_key: accessKey }) // , base: baseSymbol temporary removed
        .reply(500, "Internal server error");

      await expect(
        provider.getExchangeRatesFor(baseSymbol),
      ).to.be.eventually.rejectedWith(
        ProviderError,
        `Provider not handled the request with following code: [ERR_BAD_RESPONSE]`,
      );
    });

    it("Should get back object of rates on successful request", async () => {
      const responseMock = {
        success: true,
        timestamp: 1519296206,
        base: "USD",
        date: "2021-03-17",
        rates: {
          GBP: 0.72007,
          JPY: 107.346001,
          EUR: 0.813399,
        },
      };
      nock(apiUrl)
        .get(`/v1/latest`)
        .query({ access_key: accessKey }) //, base: baseSymbol temporary removed
        .reply(200, responseMock);

      const response = await provider.getExchangeRatesFor(baseSymbol);

      expect(response).to.be.eql(responseMock.rates);
    });
  });
});
