import express from "express";
import exchangeRouter from "./routers/exchange-router.js";

export const runServer = async (port) => {
  if (!port) {
    process.exit(1);
  }

  const apiPath = "/api/v1";
  const app = express();

  const server = app.listen(port, () => {
    console.log(`Exchange rate app listening on port ${port}!`);
  });

  app.use(apiPath + "/exchange-rate", exchangeRouter);

  app.use((error, req, res) => {
    res.status(error.status || 500);

    res.json({
      status: error.status,
      message: error.message,
      ...(process.env.NODE_ENV === "dev" && { stack: error.stack }),
    });
  });

  return server;
};
