import { VideoMetadata } from "../dtos/video-metadata";
import { Logger, LogLevel } from "../misc/logger";
import { MsPrSecond } from "../misc/time";
import { getVideoMetadata } from "../../tests/utility";
import { Encoder } from "./encoder";

describe('encoder', () => {
  let unit: Encoder;

  beforeEach(() => {
    const logger = new Logger(LogLevel.INFO, 'Encoder');
    unit = new Encoder(logger);
  })

  test.each([
    getVideoMetadata({ encodingTime: 1 }),
    getVideoMetadata({ encodingTime: 0.5 }),
    getVideoMetadata({ encodingTime: 0.2 }),
  ])('should encode in predictable span of time', async (data: VideoMetadata) => {
    // Act
    const result = await unit.encodeAsync(data);
    // Assert
    expect(result).toBe(data);
  });

  test.each([
    getVideoMetadata({ encodingTime: 1 }),
    getVideoMetadata({ encodingTime: 0.5 }),
    getVideoMetadata({ encodingTime: 0.2 }),
  ])('should encode in predictable span of time', async (data: VideoMetadata) => {
    // Arrange
    const expectedEncodingTimeInS = data.encodingTime;
    const deltaInMS = 50;
    const before = new Date();
    // Act
    const result = await unit.encodeAsync(data);
    // Assert
    const after = new Date();

    expect(after.getTime()).toBeGreaterThan(
      before.getTime() + (expectedEncodingTimeInS * MsPrSecond) - deltaInMS
    );

    expect(after.getTime()).toBeLessThan(
      before.getTime() + (expectedEncodingTimeInS * MsPrSecond) + deltaInMS
    );
  });
});
