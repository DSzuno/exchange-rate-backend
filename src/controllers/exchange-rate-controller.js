import { ExchangeRateService } from "../services/exchange-rate-service.js";
import { ExchangeRateRepository } from "../repositories/exchange-rate-repository.js";
import { SymbolNotFoundError } from "../services/errors/symbol-not-found.error.js";
import { ExchangeRateProvider } from "../providers/exchange-rate-provider.js";

const service = new ExchangeRateService(
  new ExchangeRateProvider(),
  new ExchangeRateRepository(),
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
