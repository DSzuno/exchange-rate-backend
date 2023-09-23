import { ExchangeRateRepository } from "../../repositories/exchange-rate-repository.js";
import { createClient } from "redis";
import { expect } from "chai";

describe(" Exchange rate repository INTEGRATION", () => {
  let repository;
  const host = "localhost";
  const port = "6379";
  const redis = createClient({ url: `redis://${host}:${port}` });

  before(() => {
    repository = new ExchangeRateRepository({
      host,
      port,
      prefix: "test",
      updateFrequency: 60,
    });
    redis.on("error", (error) => console.error(`Error : ${error}`));
    redis.connect();
  });

  after(async () => {
    await Promise.all([repository?.tearDown(), redis?.disconnect()]);
  });

  describe("saveExchangeRatesFor()", () => {
    it('should set "test:rate:USD" with rates in Redis', async () => {
      const rates = {
        test: 100,
      };
      await repository.saveExchangeRatesFor("USD", rates);

      const redisRates = JSON.parse(await redis.get("test:rate:USD"));
      expect(redisRates).to.deep.equal(rates);
    });
  });

  describe("getExchangeRatesFor()", () => {
    it('should get the "test:rate:USD" key from redis', async () => {
      const rates = { foo: "bar" };
      await redis.set("test:rate:USD", JSON.stringify(rates));

      await expect(
        repository.getExchangeRatesFor("USD"),
      ).to.eventually.deep.equal(rates);
    });
  });
});
