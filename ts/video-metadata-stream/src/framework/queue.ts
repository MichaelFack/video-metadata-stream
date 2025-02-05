import { IQueue } from "../interfaces/framework/queue";
import { Mutex } from "../misc/mutex";

export class Queue<T> implements IQueue<T> {
  private items: T[];
  private callbacks: ((o: T) => void)[];
  private lock: Mutex;

  constructor() {
    this.items = [];
    this.callbacks = [];
    this.lock = new Mutex();
  }

  async enqueueAsync(item: T): Promise<void> {
    return await this.lock.doWorkAsync(async () => {
      const callback = this.callbacks.shift()
      if (callback) {
        callback(item)
      } else {
        this.items.push(item);
      }
    })
  }

  async dequeueAsync(): Promise<T> {
    return await this.lock.doWorkAsync(async () => {
      const item = this.items.shift();
      if (item) {
        return item;
      } else {
        let callback: (o: T) => void;
        const promise = new Promise<T>((resolve) => {
          callback = resolve;
        })
        this.callbacks.push(callback)
        return await promise;
      }
    })
  }
}