export interface IRunner {
  stopAsync(): Promise<void>;
  startAsync(): Promise<void>
}
