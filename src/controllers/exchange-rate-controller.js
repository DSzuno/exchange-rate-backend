import { ExchangeRateService } from "../services/exchange-rate-service.js";
import { ExchangeRateRepository } from "../repositories/exchange-rate-repository.js";
import { SymbolNotFoundError } from "../services/errors/symbol-not-found.error.js";
import { ExchangeRateProvider } from "../providers/exchange-rate-provider.js";

const updateFrequency = process.env.EXCHANGE_UPDATE_FREQUENCY || 60 * 60;
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const prefix = process.env.REDIX_DB_PREFIX;

const accessKey = process.env.EXCHANGE_RATE_ACCESS_KEY || "";
const apiUrl =
  process.env.EXCHANGE_RATE_API_URL || "https://api.exchangeratesapi.io";

const service = new ExchangeRateService(
  new ExchangeRateProvider({ accessKey, apiUrl }),
  new ExchangeRateRepository({ host, port, updateFrequency, prefix }),
);

const index = async (req, res) => {
  try {
    const rate = await service.getExchangeRate(req.params.get("symbol"));
    res.body = { rate };
    res.send();
  } catch (error) {
    if (error instanceof SymbolNotFoundError) {
      res.status = 404;
    } else {
      res.status = 500;
    }
    res.send();
  }
};

export const exchangeRateController = {
  index,
};
