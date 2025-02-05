import { IMutex } from "../interfaces/misc/mutex";
import { ILogger } from "./logger";

export class Mutex implements IMutex {
  private callbacks: Promise<void>[];
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.callbacks = [];
    this.logger = logger;
  }

  async doWorkAsync<T>(work: () => Promise<T>): Promise<T> {
    // Protocol:
    // -----------------
    // Create unresolved promise.
    // Place it in the callbacks
    // If not first, await prev unresolved promise
    // return await work
    // finally remove from callbacks and resolve unresolved promise
    // -----------------
    // Comment: so basically we create a dependency chain between the promises...
    // ... such that if two calls of doWorkAsync on the same mutex ...
    // ... then the second will await the first to resolve, causing sequential behavior!
    const id = Math.random()
    this.logger.debug(id + ' - creating unresolved promise.')
    let resolver = () => {};

    const unresolvedPromise = new Promise<void>((resolve) => {
      resolver = resolve;
    });
  
    this.logger.debug(id + ' - placing unresolved promise in callbacks.')
    const callbackCount = this.callbacks.push(unresolvedPromise);

    this.logger.debug(id + ' - if not first, await previous callback.')
    const isFirstCallback = callbackCount == 1;
    if (!isFirstCallback) {
      const previousCallback = this.callbacks[callbackCount - 2];
      await previousCallback;
    }
  
    this.logger.debug(id + ' - return await work')
    return new Promise<T>(async (resolve) => {
      resolve(await work());
    }).finally(() => {
      this.logger.debug(id + ' - finally remove from callbacks and resolve unresolved promise')
      this.callbacks.shift(); // <-- Cleanup this from callbacks.
      resolver(); // <-- Signals next callback to complete.
    });
  }
}
