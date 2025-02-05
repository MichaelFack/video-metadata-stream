import { IMutex } from "../interfaces/misc/mutex";
import { ILogger, Logger, LogLevel } from "./logger";
import { Result } from "./result";

export const MsPrSecond = 1000 // Baseline: milisecond; thread.sleep(ms).
export const Seconds = 1 // Seconds pr second
export type TimeInMS = number
export type TimeInS = number
export type PromiseWithCancel<T> = { promise: Promise<T | void>, cancel: () => Promise<void> };
export type CancelationCallback = (cancelation: () => Promise<void>) => Promise<void>;

export interface IDelayer {
  /*
   * Example uses:
   * ----------------------
   * const delay = new Delayer(...).delay(100);
   * await delay.promise
   * ----------------------
   * const delay = new Delayer(...).delay(100);
   * const anotherPromise = new Promise(...).then((value) => {
   *   await delay.cancel();
   *   return value;
   * });
   * const result = await Promise.race([delay.promise, anotherPromise])
   * 
   */
  delay(delayInMS: TimeInMS): PromiseWithCancel<Result<void, void>>;
}

export class Delayer implements IDelayer {
  private isRunning: boolean;
  private mutex: IMutex;
  private start: number;
  private logger: ILogger;

  constructor(logger: ILogger, mutex: IMutex) {
    this.isRunning = true;
    this.mutex = mutex;
    this.logger = logger;
    this.start = new Date().getTime();
  }

  delay(delayInMS: TimeInMS): PromiseWithCancel<Result<void, void>> {
    return {
      promise: new Promise(
        async (resolve) => {
          while (await this.mutex.doWorkAsync(async () => this.isRunning)) {
            if (this.start + delayInMS < new Date().getTime()) {
              resolve({ success: true })
            }
            await new Promise<void>(() => {
              setTimeout(resolve, 10)
            })
          }
          resolve({ success: false })
        }
      ),
      cancel: async () => {
        await this.mutex.doWorkAsync(async () => { 
          this.isRunning = false;
        });
      }
    }
  }

  async timeout<T>(promiseWithCancel: PromiseWithCancel<T>, timeoutInMs: TimeInMS): Promise<T | void> {
    const delaying = this.delay(timeoutInMs);
    await Promise.race([delaying.promise, promiseWithCancel]);
    // Cancel both: if complete, this can't hurt.
    await promiseWithCancel.cancel();
    await delaying.cancel();
    // If promise with cancel was cancelled this should return void otherwise this should return T.
    return await promiseWithCancel.promise;
  }
}
