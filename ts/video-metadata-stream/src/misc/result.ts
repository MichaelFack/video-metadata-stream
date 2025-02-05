export type Success<T> = T extends void? { success: true } : { result: T, success: true }
export type Failure<E extends Error | void> = E extends void ? { success: false } : { error: E, success: false }
export type Result<T, E extends Error | void> = Success<T> | Failure<E>
