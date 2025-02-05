import { EncodedVideoMetadata } from "../dtos/encoded-video-metadata";
import { VideoMetadata } from "../dtos/video-metadata";
import { IEncoder } from "../interfaces/video-metadata/encoder";
import { IPublisher } from "../interfaces/video-metadata/publisher";
import { Logger, LogLevel } from "../misc/logger";
import { getVideoMetadata } from "../utility.test";
import { Worker } from "../video-metadata/worker";

describe('worker', () => {
  let encoderMock: IEncoder;
  let publisherMock: IPublisher<VideoMetadata>;
  let unit: Worker;
  let encodedData: EncodedVideoMetadata;

  beforeEach(() => {
    const logger = new Logger(LogLevel.DEBUG, 'Worker');
    encodedData = getVideoMetadata({ id: 'something non-default' })
    encoderMock = {
      encodeAsync: jest.fn().mockReturnValue(new Promise<EncodedVideoMetadata>((resolve) => {
        resolve(encodedData);
      }))
    };
    publisherMock = {
      publishAsync: jest.fn().mockReturnValue(new Promise<void>((resolve) => { 
        resolve();
      }))
    };
    unit = new Worker(encoderMock, () => publisherMock, logger);
  });

  test('should return success', async () => {
    // Arrange
    const data = getVideoMetadata();
    // Act
    const result = await unit.doWorkAsync(data);
    // Assert
    expect(result).toBe(encodedData);
  });
});
