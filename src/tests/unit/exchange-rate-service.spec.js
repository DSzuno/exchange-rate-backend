import { ExchangeRateService } from "../../services/exchange-rate-service.js";
import { expect } from "chai";
import { ExchangeRateRepository } from "../../repositories/exchange-rate-repository.js";
import { ExchangeRateProvider } from "../../providers/exchange-rate-provider.js";
import { SymbolNotFoundError } from "../../services/errors/symbol-not-found.error.js";

describe("Exchange rate service", () => {
  let repository;
  let provider;
  let service;

  beforeEach(() => {
    repository = sandbox.createStubInstance(ExchangeRateRepository);
    provider = sandbox.createStubInstance(ExchangeRateProvider);
    service = new ExchangeRateService(provider, repository);
  });

  context.only("Supported symbol check", () => {
    it("Should call {getSupportedSymbols} of the [REPOSITORY]", async () => {
      try {
        await service.getExchangeRate("");
      } catch (err) {}
      expect(repository.getSupportedSymbols).to.have.been.calledOnce;
    });

    it("Should call {getSupportedSymbols} of the [PROVIDER] if symbol is not available in the [REPOSITORY]", async () => {
      repository.getSupportedSymbols.returns(undefined);
      try {
        await service.getExchangeRate("");
      } catch (e) {}

      expect(provider.getSupportedSymbols).to.have.been.calledOnce;
    });

    it("Should not call {getSupportedSymbols} of the [PROVIDER] if symbol available in the [REPOSITORY]", async () => {
      const supportedSymbols = new Set(["USD"]);
      repository.getSupportedSymbols.returns(supportedSymbols);

      await service.getExchangeRate("USD");

      expect(provider.getSupportedSymbols).to.not.have.been.called;
    });

    it("Should throw symbol not found error", async () => {
      provider.getSupportedSymbols.returns(undefined);

      const symbol = "USD";

      await expect(
        service.getExchangeRate(symbol),
      ).to.be.eventually.rejectedWith(
        SymbolNotFoundError,
        `The following symbol is not supported: [${symbol}]`,
      );
    });

    it("Should call {saveSupportedSymbols} if rate [PROVIDER] provide value", async () => {
      provider.getSupportedSymbols.returns(["USD"]);
      repository.saveExchangeRatesFor.returns(["USD"]);

      try {
        await service.getExchangeRate("");
      } catch (e) {}

      expect(repository.saveSupportedSymbols).to.have.been.calledOnce;
    });
  });

  context("Supported symbol found", () => {
    const symbol = "USD";
    const supportedSymbols = new Set(["USD"]);
    let rate;

    beforeEach(async () => {
      repository.getSupportedSymbols.returns(supportedSymbols);
      rate = await service.getExchangeRate(symbol);
    });

    it("Should call {getExchangeRatesFor} on [REPOSITORY] to check rate in storage", async () => {
      repository.getExchangeRatesFor.returns("");

      const service = new ExchangeRateService(provider, repository);

      await service.getExchangeRate("USD");

      expect(repository.getExchangeRatesFor).to.have.been.calledOnce;
    });

    it("Should call {getExchangeRatesFor} on [PROVIDER] to get rates", async () => {
      repository.getExchangeRatesFor.returns(undefined);
      provider.getExchangeRatesFor.returns([""]);

      const service = new ExchangeRateService(provider, repository);

      await service.getExchangeRate("USD");

      expect(provider.getExchangeRatesFor).to.have.been.calledOnce;
    });

    it("Should call {saveExchangeRatesForStub} on [REPOSITORY] to save rates when successfully get from [PROVIDER]", async () => {
      repository.getExchangeRatesFor.returns(undefined);
      provider.getExchangeRatesFor.returns(["USD"]);

      const service = new ExchangeRateService(provider, repository);

      await service.getExchangeRate("USD");

      expect(repository.saveExchangeRatesFor).to.have.been.calledOnce;
    });
  });
});
