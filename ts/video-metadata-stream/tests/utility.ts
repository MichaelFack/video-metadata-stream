import { VideoMetadata } from "../src/dtos/video-metadata";

export function getVideoMetadata(overrides: Partial<VideoMetadata> = {}): VideoMetadata {
  return {
    ...overrides,
    id: 'id',
    title: 'title',
    provider: 'provider',
    encodingTime: 0.1,
    publicationTimeout: 0.1
  }
}
