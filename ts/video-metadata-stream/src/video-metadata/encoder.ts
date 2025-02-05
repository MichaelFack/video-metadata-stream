import { EncodedVideoMetadata } from "../dtos/encoded-video-metadata";
import { VideoMetadata } from "../dtos/video-metadata";
import { IEncoder } from "../interfaces/video-metadata/encoder";
import { ILogger } from "../misc/logger";
import { MsPrSecond } from "../misc/time";

export class Encoder implements IEncoder {
  private logger: ILogger;
  
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async encodeAsync(data: VideoMetadata): Promise<EncodedVideoMetadata> {
    // Dummy implementation
    this.logger.debug('Starting encoding of: ' + JSON.stringify(data));
    await new Promise<void>(
      (resolve) => {
        setTimeout(() => { resolve(); }, // TODO: Replace this sleep-wait with thread simulating busy-wait
        data.encodingTime * MsPrSecond
      );
    });
    this.logger.debug('Ending encoding of: ' + JSON.stringify(data));
    return data;
  }
}
