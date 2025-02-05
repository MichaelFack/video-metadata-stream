import { EncodedVideoMetadata } from "../dtos/encoded-video-metadata";
import { VideoMetadata } from "../dtos/video-metadata";
import { IEncoder as IEncoder } from "../interfaces/video-metadata/encoder";
import { IPublisher } from "../interfaces/video-metadata/publisher";
import { IWorker } from "../interfaces/framework/worker";
import { MsPrSecond } from "../misc/time";
import { ILogger } from "../misc/logger";
import { Failure, Result, Success } from "../misc/result";

export class Worker implements IWorker<VideoMetadata> {
  private encoder: IEncoder;
  private publisherCallback: () => IPublisher<EncodedVideoMetadata>;
  private logger: ILogger;

  constructor(
    encoder: IEncoder,
    publisherCallback: () => IPublisher<EncodedVideoMetadata>,
    logger: ILogger
  ) {
    this.encoder = encoder;
    this.publisherCallback = publisherCallback;
    this.logger = logger;
  }

  async doWorkAsync(data: VideoMetadata): Promise<Result<void, void>> {
    // TODO: Implement multi-thread-like behavior, shutting down the work...
    // ... gracefully on timeout before returning.
    const timeoutPromise = new Promise<Failure<void>>((resolve) => {
      setTimeout(
        () => {
          this.logger.warn('Timeout working with: ' + JSON.stringify(data));
          resolve({ success: false });
        },
        data.publicationTimeout * MsPrSecond
      ) // TODO: Replace this sleep-wait with thread simulating busy-wait
    });

    const workPromise = new Promise<Success<void>>(async (resolve) => {
      this.logger.warn('Started working with: ' + JSON.stringify(data));
      await this.workAsync(data);
      this.logger.warn('Done working with: ' + JSON.stringify(data));
      resolve({ success: true });
    })

    return Promise.race([workPromise, timeoutPromise]);
  }

  private async workAsync(data: VideoMetadata): Promise<void> {
    this.logger.debug('Starting encoding async');
    await this.encoder.encodeAsync(data).then((encodedData) => {
      this.logger.debug('Done encoding - starting publishing async');
      this.publisherCallback().publishAsync(encodedData).then(() => {
        this.logger.debug('Done publishing');
      });
    })
  }
}
