import { LogLevel } from "./logger"

// TODO: These consts should be configurable. Environment variables with defaults.
// There's some pretty cool ways of doing this in conjunction with dependency injection.

// Snippet:
// Video metadata objects from the ingest file stream should be delivered for encoding...
// ... at a maximum rate of 2 objects per second.
export const ingestRatePrSecond = 2; // Rate of "raw" video metadata to be ingested.
// Snippet:
// A maximum of 10 encoders are available.
export const maxEncoderAmount = 10; // Maximum amount of encoders running in parralel.

export const logLevel = LogLevel.INFO;
