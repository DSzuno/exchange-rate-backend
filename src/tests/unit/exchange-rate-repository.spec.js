import { ExchangeRateRepository } from "../../repositories/exchange-rate-repository.js";
import { expect } from "chai";

describe("Exchange rate repository UNIT", () => {
  it("should call {set} of redis client with an expiration date", async () => {
    const redisClient = {
      disconnect: sandbox.stub().resolves(),
      set: sandbox.stub().resolves(),
    };
    const repository = new ExchangeRateRepository({
      redisClient,
      prefix: "test",
      updateFrequency: 60,
    });
    const rates = { foo: 200 };
    await repository.saveExchangeRatesFor("USD", rates);
    expect(redisClient.set).to.have.been.calledOnceWith(
      "test:rate:USD",
      JSON.stringify(rates),
      { EX: 60 },
    );
  });
});
