import { EncodedVideoMetadata } from "../dtos/encoded-video-metadata";
import { VideoMetadata } from "../dtos/video-metadata";

export interface IEncoder {
  encodeAsync(data: VideoMetadata): Promise<EncodedVideoMetadata>
}
