export class MutexLock {
  private isLocked: boolean = false;

  acquireAsync(): Promise<void> {
    // Naive 'try again in a bit' busy-wait implementation
    return new Promise((resolve) => {
      if (this.isLocked) {
        setTimeout(() => this.acquireAsync().then(resolve), 10);
      } else {
        this.isLocked = true;
        resolve();
      }
    });
  }

  unlock(): void {
    this.isLocked = false;
  }

  async doWorkAsync<T>(work: () => Promise<T>): Promise<T> {
    return await this.acquireAsync().then(work).finally(this.unlock)
  }
}