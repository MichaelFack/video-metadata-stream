import { ReadStream } from "fs";
import { createInterface } from "readline"
import { IIngestor as IIngestor } from "../interfaces/ingestor";
import { IQueue } from "../interfaces/framework/queue";
import { VideoMetadata } from "../dtos/video-metadata";
import { MsPrSecond, TimeInMS } from "../misc/time";
import { IFileStream } from "../interfaces/framework/filestream";
import { ILogger } from "../misc/logger";

// This is one of the reasons I love typescript:
// You can do some really fancy complex typing, which doesn't impact runtime performance.
type ParseResult<T> =
    | { parsed: T; success: true }
    | { success: false }

export class Ingestor implements IIngestor {
  private msPrIngestion: TimeInMS;
  private outQueue: IQueue<VideoMetadata>;
  private logger: ILogger;
  
  constructor(
    maxRateOfIngestionPrSecond: number,
    outQueue: IQueue<VideoMetadata>,
    logger: ILogger
  ) {
    this.logger = logger;
    this.msPrIngestion = MsPrSecond / maxRateOfIngestionPrSecond
    this.outQueue = outQueue;
  }

  async ingestAsync(filestream: IFileStream): Promise<void> {
    this.logger.debug('Ingesting filestream at rate of once pr ' + this.msPrIngestion + 'ms')
    const lines = filestream.readAsync()
    // Snippet:
    // Each line in the ingest file represents a video metadata object separated by a new line (\n).
    for await (const line of lines) {
      this.logger.debug('Ingesting line: ' + line)
      
      let ingestPromise = new Promise<void>(async (resolve) => {
        const parseResult = this.parse(line)
        if (parseResult.success){
          this.logger.debug('Ingestion of line succeeded. Enqueueing result.')
          await this.outQueue.enqueueAsync(parseResult.parsed)
          this.logger.debug('Ingestion of line enqueueing succeeded.')
        } else {
          this.logger.warn('Ingestion of line failed. Line: ' + line)
        }
        resolve()
      });

      let delayPromise = new Promise(async (resolve) => {
        setTimeout(resolve, this.msPrIngestion)
      });

      await Promise.all([ingestPromise, delayPromise])
    }
  }

  private parse(string: string): ParseResult<VideoMetadata> {
    // Snippet:
    // An object consists of an ID, title, provider, encoding time, and publication timeout.
    return this.safeJsonParse(this.isVideoMetadataDto)(string)
  }

  private isVideoMetadataDto(o: any): o is VideoMetadata {
    return 'id' in o && 'title' in o && 'provider' in o && 'encodingTime' in o && 'publicationTimeout' in o;
  }

  private safeJsonParse = <T>(guard: (o: any) => o is T) => (text: string): ParseResult<T> => {
    const parsed = JSON.parse(text)
    return guard(parsed) ? { parsed, success: true } : { success: false }
  }
}
