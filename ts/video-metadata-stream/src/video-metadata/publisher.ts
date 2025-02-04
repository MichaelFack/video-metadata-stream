import { VideoMetadata } from "../dtos/video-metadata";
import { IPublisher } from "../interfaces/publisher";
import { MsPrSecond, Seconds, TimeInMS, TimeInS } from "../misc/time";

export class Publisher implements IPublisher<VideoMetadata> {
  private minDelayInS: number;
  private maxDelayInS: number;
  
  constructor(minDelayInS: TimeInS, maxDelayInS: TimeInS) {
    this.minDelayInS = minDelayInS;
    this.maxDelayInS = maxDelayInS;
  }

  async publishAsync(data: VideoMetadata): Promise<void> {
    // Dummy implementation. Ideally there should be some sort of graceful termination herein.
    await new Promise(() => { 
      setTimeout(() => {},
        this.getRandomDelay(this.minDelayInS * MsPrSecond, this.maxDelayInS * MsPrSecond)
      )
    })
  }

  private getRandomDelay(minInMs: TimeInMS, maxInMs: TimeInMS): TimeInMS {
    return Math.floor(Math.random() * (maxInMs - minInMs + 1) + minInMs);
  }
}
