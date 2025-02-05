import { Result } from "../../misc/result";

export interface IWorker<TIn> {
  doWorkAsync(data: TIn): Promise<Result<void, void>>
}
