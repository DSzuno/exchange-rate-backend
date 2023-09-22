export class SymbolNotFoundError extends Error {
  constructor(symbol) {
    super(`The following symbol is not supported: [${symbol}]`);
  }
}
