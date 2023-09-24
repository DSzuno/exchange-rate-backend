import { ExchangeRateService } from "../services/exchange-rate-service.js";
import { ExchangeRateRepository } from "../repositories/exchange-rate-repository.js";
import { SymbolNotFoundError } from "../services/errors/symbol-not-found.error.js";
import { ExchangeRateProvider } from "../providers/exchange-rate-provider.js";

const updateFrequency = process.env.EXCHANGE_UPDATE_FREQUENCY || 3600;
const host = process.env.REDIS_HOST || "cache";
const port = process.env.REDIS_PORT || "6379";
const prefix = process.env.REDIX_DB_PREFIX || "test";
const accessKey = process.env.EXCHANGE_RATE_ACCESS_KEY || "";

const apiUrl =
  process.env.EXCHANGE_RATE_API_URL || "http://api.exchangeratesapi.io";

const service = new ExchangeRateService(
  new ExchangeRateProvider({ accessKey, apiUrl }),
  new ExchangeRateRepository({ host, port, updateFrequency, prefix }),
);

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const index = async (req, res) => {
  try {
    const rate = await service.getExchangeRate(req.query.symbol);

    res.send({ rate }).status(200);
  } catch (error) {
    console.warn(error);
    if (error instanceof SymbolNotFoundError) {
      res.status(404);
    } else {
      res.status(500);
    }
    res.send();
  }
};

export const exchangeRateController = {
  index,
};
