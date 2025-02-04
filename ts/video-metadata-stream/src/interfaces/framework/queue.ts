export interface IQueue<T> {
  enqueueAsync(item: T): Promise<void>
  dequeueAsync(): Promise<T>
}
