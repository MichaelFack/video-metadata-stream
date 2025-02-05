import { VideoMetadata } from "../dtos/video-metadata";
import { IPublisher } from "../interfaces/video-metadata/publisher";
import { ILogger } from "../misc/logger";
import { CancelationCallback, delay, MsPrSecond, Seconds, TimeInMS, TimeInS } from "../misc/time";

export class Publisher implements IPublisher<VideoMetadata> {
  private minDelayInS: number;
  private maxDelayInS: number;
  private getRandomNumberBetween0And1: () => number;
  logger: ILogger;
  
  constructor(
    minDelayInS: TimeInS,
    maxDelayInS: TimeInS,
    logger: ILogger,
    getRandomNumberBetween0And1: () => number = Math.random
  ) {
    this.minDelayInS = minDelayInS;
    this.maxDelayInS = maxDelayInS;
    this.logger = logger;
    this.getRandomNumberBetween0And1 = getRandomNumberBetween0And1;
  }

  async publishAsync(data: VideoMetadata, cancellationCallback: CancelationCallback): Promise<void> {
    // Dummy implementation. Ideally there should be some sort of graceful termination herein.
    await new Promise(async () => { 
      const randomDelayBetweenMinAndMaxInMS = this.getRandomDelay(this.minDelayInS * MsPrSecond, this.maxDelayInS * MsPrSecond);
      const delaying = delay(randomDelayBetweenMinAndMaxInMS);
      await cancellationCallback(delaying.cancelAsync);
      await delaying.promise;
    })
  }

  private getRandomDelay(minInMS: TimeInMS, maxInMS: TimeInMS): TimeInMS {
    const randomNumberBetween0And1 = this.getRandomNumberBetween0And1();
    const randomDelayBetweenMinAndMaxInMS = Math.floor(randomNumberBetween0And1 * (maxInMS - minInMS + 1) + minInMS);
    this.logger.debug('Random delay: ' + randomDelayBetweenMinAndMaxInMS + '(ms), generated number: ' + randomNumberBetween0And1)
    return randomDelayBetweenMinAndMaxInMS;
  }
}
