import { ExchangeRateService } from "../../services/exchange-rate-service.js";
import sinon from "sinon";
import { expect } from "chai";
import { ExchangeRateRepository } from "../../repositories/exchange-rate-repository.js";
import { ExchangeRateProvider } from "../../providers/exchange-rate-provider.js";
import { SymbolNotFoundError } from "../../services/errors/symbol-not-found.error.js";

describe("Exchange rate service", () => {
  let exchangeRateRepository;
  let exchangeRateProvider;
  beforeEach(() => {
    exchangeRateRepository = new ExchangeRateRepository();
    exchangeRateProvider = new ExchangeRateProvider();
  });

  context("Supported symbol check", () => {
    it("Should call {getSupportedSymbols} from [REPOSITORY] layer", async () => {
      const getSupportedSymbolsSpy = sinon.spy(
        exchangeRateRepository,
        "getSupportedSymbols",
      );

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );
      try {
        await service.getExchangeRate("");
      } catch (e) {}

      expect(getSupportedSymbolsSpy.called).to.be.true;
    });

    it("Should call [PROVIDER] {getSupportedSymbols} if symbol not available locally", async () => {
      const getSupportedSymbolsStub = sinon
        .stub(exchangeRateProvider, "getSupportedSymbols")
        .returns(undefined);

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );

      try {
        await service.getExchangeRate("");
      } catch (e) {}

      expect(getSupportedSymbolsStub.called).to.be.true;
    });

    it("Should not call [PROVIDER] {getSupportedSymbols} if symbol available locally", async () => {
      sinon
        .stub(exchangeRateRepository, "getSupportedSymbols")
        .returns(["USD"]);
      const getSupportedSymbolsStub = sinon
        .stub(exchangeRateProvider, "getSupportedSymbols")
        .returns(undefined);

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );

      try {
        await service.getExchangeRate("");
      } catch (e) {}

      expect(getSupportedSymbolsStub.called).to.be.false;
    });

    it("Should throw symbol not found error", async () => {
      sinon
        .stub(exchangeRateProvider, "getSupportedSymbols")
        .returns(undefined);

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );
      const symbol = "USD";
      try {
        await service.getExchangeRate(symbol);
      } catch (e) {
        //expect(e).eqls(SymbolNotFoundError);
        expect(e.message).eqls(
          `The following symbol is not supported: [${symbol}]`,
        );
      }
    });

    it("Should call {saveSupportedSymbols} if rate [PROVIDER] provide value", async () => {
      sinon.stub(exchangeRateProvider, "getSupportedSymbols").returns(["USD"]);

      const saveSupportedSymbolsStub = sinon
        .stub(exchangeRateRepository, "saveSupportedSymbols")
        .returns(["USD"]);

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );

      try {
        await service.getExchangeRate("");
      } catch (e) {}

      expect(saveSupportedSymbolsStub.called).to.be.true;
    });
  });

  context("Supported symbol found", () => {
    beforeEach(() => {
      const set = new Set();
      set.add("USD");
      sinon.stub(exchangeRateRepository, "getSupportedSymbols").returns(set);
    });
    it("Should call {getExchangeRatesFor} on [REPOSITORY] to check rate in storage", async () => {
      const getExchangeRatesForStub = sinon
        .stub(exchangeRateRepository, "getExchangeRatesFor")
        .returns("");

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );

      await service.getExchangeRate("USD");

      expect(getExchangeRatesForStub.called).to.be.true;
    });

    it("Should call {getExchangeRatesFor} on [PROVIDER] to get rates", async () => {
      sinon
        .stub(exchangeRateRepository, "getExchangeRatesFor")
        .returns(undefined);
      const getExchangeRatesForStub = sinon
        .stub(exchangeRateProvider, "getExchangeRatesFor")
        .returns([""]);

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );

      await service.getExchangeRate("USD");

      expect(getExchangeRatesForStub.called).to.be.true;
    });

    it("Should call {getExchangeRatesFor} on [PROVIDER] to get rates", async () => {
      sinon
        .stub(exchangeRateRepository, "getExchangeRatesFor")
        .returns(undefined);
      sinon.stub(exchangeRateProvider, "getExchangeRatesFor").returns(["USD"]);
      const saveExchangeRatesForStub = sinon.stub(
        exchangeRateRepository,
        "saveExchangeRatesFor",
      );

      const service = new ExchangeRateService(
        exchangeRateProvider,
        exchangeRateRepository,
      );

      await service.getExchangeRate("USD");

      expect(saveExchangeRatesForStub.called).to.be.true;
    });
  });
});
