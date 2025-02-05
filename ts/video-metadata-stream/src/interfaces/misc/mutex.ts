export interface IMutex {
  doWorkAsync<T>(work: () => Promise<T>): Promise<T>;
}
