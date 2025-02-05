import { CancelationCallback } from "../../misc/time";

export interface IPublisher<T> {
  publishAsync(data: T, cancellationCallback: CancelationCallback): Promise<void>
}
