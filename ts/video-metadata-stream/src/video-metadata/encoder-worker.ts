import { EncodedVideoMetadata } from "../dtos/encoded-video-metadata";
import { VideoMetadata } from "../dtos/video-metadata";
import { TimeoutException } from "../misc/exceptions";
import { IEncoder as IEncoder } from "../interfaces/encoder";
import { IPublisher } from "../interfaces/publisher";
import { IWorker } from "../interfaces/framework/worker";
import { MsPrSecond } from "../misc/time";

export class EncoderWorker implements IWorker<VideoMetadata> {
  private encoder: IEncoder;
  private publisherCallback: () => IPublisher<EncodedVideoMetadata>;

  constructor(encoder: IEncoder, publisherCallback: () => IPublisher<EncodedVideoMetadata>) {
    this.encoder = encoder;
    this.publisherCallback = publisherCallback;
  }

  async doWorkAsync(data: VideoMetadata): Promise<void> {
    try {
      // TODO: Implement multi-thread-like behavior, shutting down the work...
      // ... gracefully on timeout before returning.
      return await this.awaitWithTimeout(
        this.workAsync(data),
        data.publicationTimeout * MsPrSecond
      )
    } catch (error) {
      if (error instanceof TimeoutException) {
        // TODO: Log timeout exception
      } else {
        // TODO: Log error occurred
      }
    }
  }

  private async workAsync(data: VideoMetadata): Promise<void> {
    await this.encoder.encodeAsync(data).then((encodedData) => {
      this.publisherCallback().publishAsync(encodedData)
    })
  }

  private awaitWithTimeout(promise: Promise<void>, timeoutInMS: number) {
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => { reject(new TimeoutException()) }, timeoutInMS)
    });
    return Promise.race([promise, timeoutPromise])
  }
}
