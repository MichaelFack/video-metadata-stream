export interface IPublisher<T> {
  publishAsync(data: T): Promise<void>
}
