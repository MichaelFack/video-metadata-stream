import { VideoMetadata } from "../dtos/video-metadata";
import { IFileStream } from "../interfaces/framework/filestream";
import { IQueue } from "../interfaces/framework/queue";
import { Logger, LogLevel } from "../misc/logger";
import { Ingestor } from "./ingestor";
import { ReadStream } from "fs";

jest.mock("../interfaces/framework/queue");

describe('ingestor', () => {
  let queueMock: IQueue<VideoMetadata>;
  let unit: Ingestor;

  beforeEach(() => {
    queueMock = {
      enqueueAsync: jest.fn(),
      dequeueAsync: jest.fn()
    };
    const logger = new Logger(LogLevel.DEBUG, 'Ingestor');
    unit = new Ingestor(1000, queueMock, logger);
  });

  test('should enqueue items produced from filestream strings', async () => {
    // Arrange
    const streamItems = [
      '{"id":"b385fcf5-bacf-4242-892c-3ed08799a775","title":"Det sidste ord: Peter Belli","provider":"TV 2","encodingTime":6,"publicationTimeout":7}',
      '{"id":"6b34f304-7425-42c6-a7cb-7ccac6362cac","title":"Nyhederne: 7 Nyhederne, 8. juli","provider":"TV 2","encodingTime":1,"publicationTimeout":3}',
      '{"id":"e954069a-1950-44c4-9cba-a6aff5cb917f","title":"Nyhederne: 21.30 Nyhederne, 10. juli","provider":"TV 2","encodingTime":5,"publicationTimeout":9}'
    ];
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          i: 0,
          next() {
            if (this.i < streamItems.length){
              return Promise.resolve({ value: streamItems[this.i++], done: false });
            }
            return Promise.resolve({ done: true });
          }
        };
      }
    };
    const filestreamMock = {
      readAsync: jest.fn().mockReturnValue(asyncIterable),
    };
    // Act
    await unit.ingestAsync(filestreamMock)
    // Assert
    expect(queueMock.enqueueAsync).toHaveBeenCalledTimes(3);
    expect(queueMock.dequeueAsync).toHaveBeenCalledTimes(0);
  });
});
