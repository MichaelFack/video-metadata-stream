export interface IWorker<TIn> {
  doWorkAsync(data: TIn): Promise<void>
}
