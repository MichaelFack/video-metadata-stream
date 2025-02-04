import { IQueue } from "../interfaces/framework/queue";
import { IWorker } from "../interfaces/framework/worker";
import { IWorkerPool } from "../interfaces/framework/worker-pool";
import { Runner } from "./runner";
import { MutexLock } from "./mutex-lock";


export class WorkerPool<TIn> extends Runner implements IWorkerPool {
  private amountOfWorkersMax: number;
  private idleWorkers: IWorker<TIn>[];
  private idleWorkersMutex: MutexLock;
  private inQueue: IQueue<TIn>;
  private getItemPromise: Promise<TIn> | undefined;
  private workerCallback: () => IWorker<TIn>;
  private workers: IWorker<TIn>[];
  private workersMutex: MutexLock;

  constructor(
    amountOfWorkersMax: number,
    inQueue: IQueue<TIn>,
    workerCallback: () => IWorker<TIn> 
  ) {
    super();
    this.amountOfWorkersMax = amountOfWorkersMax;
    this.idleWorkers = [];
    this.idleWorkersMutex = new MutexLock();
    this.inQueue = inQueue;
    this.workerCallback = workerCallback;
    this.workers = [];
    this.workersMutex = new MutexLock();
  }

  protected async runOnceAsync(): Promise<void> {
    // Cyclicly awaits dequeueing.
    // On cyclic awaiting of dequeueing, don't dequeue next item.
    if (!this.getItemPromise) {
      this.getItemPromise = this.inQueue.dequeueAsync();
    }

    // Busy-wait for next item to be dequeued.
    const waitABitPromise = this.getWaitABitPromise();
    const item = await Promise.race([this.getItemPromise, waitABitPromise]);
    if (!item) {
      return; // Wait a bit more. Also checks if should be still running.
    }

    // We dequeued an item. Schedule a worker to handle it.

    // Get an idle worker:
    let worker = await this.getIdleWorker();
    // If we didn't get an idle worker, get a new worker.
    if (!worker) {
      worker = await this.getNewWorker();
    }
    // If we didn't get a new worker, we cannot schedule the item for work right now.
    if (!worker) {
      // Since we already got the item the getItemPromise returns immediately...
      // ... and we might return to this point in code almost immediately.
      // To avoid busy-waiting like so; we wait a bit before returning.
      await this.getWaitABitPromise();
      return;
    }

    this.scheduleWorkForWorker(worker, item);
    this.getItemPromise = undefined;
  }

  private getWaitABitPromise(): Promise<void> {
    return new Promise<void>(() => setTimeout(() => { }, 10)); // TODO: make interval configurable
  }

  private async getIdleWorker() {
    return await this.idleWorkersMutex.doWorkAsync(async () => {
      return this.idleWorkers.pop();
    });
  }

  private async getNewWorker(): Promise<IWorker<TIn | undefined>> {
    return await this.workersMutex.doWorkAsync(async () => {
      if (this.workers.length >= this.amountOfWorkersMax) {
        return undefined; // We are capped w.r.t. amount of workers.
      }

      const worker = this.workerCallback();
      this.workers.push(worker);
      return worker;
    })
  }

  private scheduleWorkForWorker(worker: IWorker<TIn>, item: TIn) {
    worker.doWorkAsync(item).then(() => this.idleWorker(worker));
  }

  private idleWorker(worker: IWorker<TIn>) {
    this.idleWorkersMutex.doWorkAsync(async () => {
      // If there's just less than two idle workers, this worker becomes idle...
      if (this.idleWorkers.length < 2) {
        this.idleWorkers.push(worker);
      }
      // ... otherwise forget the worker. It will be garbage collected.
      this.workersMutex.doWorkAsync(async () => {
        const index = this.workers.indexOf(worker)
        this.workers.splice(index, 1)
      });
    });
  }
}
