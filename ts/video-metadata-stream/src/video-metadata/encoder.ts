import { EncodedVideoMetadata } from "../dtos/encoded-video-metadata";
import { VideoMetadata } from "../dtos/video-metadata";
import { IEncoder } from "../interfaces/encoder";
import { MsPrSecond } from "../misc/time";

export class Encoder implements IEncoder {
  async encodeAsync(data: VideoMetadata): Promise<EncodedVideoMetadata> {
    // Dummy implementation
    await new Promise(() => { setTimeout(() => { }, data.encodingTime * MsPrSecond); });
    return data;
  }
}