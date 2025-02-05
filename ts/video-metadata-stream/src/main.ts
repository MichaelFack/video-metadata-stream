import { WorkerPool } from "./framework/worker-pool";
import { VideoMetadata } from "./dtos/video-metadata";
import { Queue } from "./framework/queue";
import { Ingestor } from "./video-metadata/ingestor";
import * as consts from "./misc/consts";
import { Worker } from "./video-metadata/worker";
import { Encoder } from "./video-metadata/encoder";
import { Publisher } from "./video-metadata/publisher";
import { Provider } from "./video-metadata/provider";

// Snippet:
// The system receives video metadata from a provider...
const provider = new Provider();
// Snippet:
// ...via a file stream.
const stream = provider.getFileStream();

// A jobqueue for passing ingested video metadata to the worker pool.
const metadataQueue = new Queue<VideoMetadata>()

// Video metadata objects must be parsed and ingested into your system from this file.
// Each object should only be ingested once.
const ingestor = new Ingestor(consts.ingestRatePrSecond, metadataQueue)

// A crude application of the worker pool pattern.
const workerPool = new WorkerPool(
  consts.maxEncoderAmount,
  metadataQueue,
  () => new Worker(
    new Encoder(), 
    () => new Publisher()
  )
)

// Start ingesting stream.
const ingestion = ingestor.ingestAsync(stream); 
// Start scheduling workers.
const workingPool = workerPool.startAsync();

Promise.all([ingestion, workingPool])
