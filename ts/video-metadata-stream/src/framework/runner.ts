import { IRunner } from "../interfaces/framework/runner";
import { MutexLock } from "./mutex-lock";

export abstract class Runner implements IRunner {
  private isRunningMutex: MutexLock;
  private _isRunning: boolean;

  protected get isRunning(): Promise<boolean> {
    return this.isRunningMutex.doWorkAsync<boolean>(async () => {
      return this._isRunning;
    })
  }

  // setters cannot be async and cannot have return type, so this cannot be a setter.
  protected async setIsRunning(isRunning: boolean) {
    await this.isRunningMutex.doWorkAsync<void>(async () => {
      this._isRunning = isRunning;
    })
  }

  public async stopAsync(): Promise<void> {
    await this.setIsRunning(false);
  }

  public async startAsync(): Promise<void> {
    if (await this.isRunning) {
      return; // Already running - Only designed to be running one at a time.
    }

    await this.setIsRunning(true)

    while (await this.isRunningMutex.doWorkAsync<boolean>(async () => {
      return this.isRunning;
    })) {
      await this.runOnceAsync();
    }
  }

  protected abstract runOnceAsync(): Promise<void>;
}
