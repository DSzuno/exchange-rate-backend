export class ProviderError extends Error {
  constructor(code) {
    super(`Provider not handled the request with following code: [${code}]`);
  }
}
