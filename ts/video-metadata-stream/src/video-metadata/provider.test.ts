import { Logger, LogLevel } from "../misc/logger";
import { Provider } from "./provider";
import { createInterface } from "readline";

describe('Provider', () => {
  let unit: Provider;

  beforeEach(() => {
    const logger = new Logger(LogLevel.DEBUG, 'Provider');
    unit = new Provider(logger);
  });

  // A primitive test; verify the ingestor grabs the right file and all of the file by checking the amount if lines.
  test('Should find the expected amount of lines', async () => {
    // Arrange
    const expectedAmountOfLine = 154;
    // Act
    const filestream = unit.getFileStream();
    // Assert
    let lineCount = 0;
    for await (const line of filestream.readAsync()) {
      lineCount += 1;
    }
    expect(lineCount).toEqual(expectedAmountOfLine);
  });

  // Pseudo-random sampling.
  test('Should find the expected lines', async () => {
    // Arrange
    const expectedFirstLine = '{"id":"b385fcf5-bacf-4242-892c-3ed08799a775","title":"Det sidste ord: Peter Belli","provider":"TV 2","encodingTime":6,"publicationTimeout":7}';
    const expectedLastLine = '{"id":"b7da45e4-5aab-470c-a0d4-038e8cda2fe4","title":"De sjældne danskere","provider":"TV 2","encodingTime":2,"publicationTimeout":8}';
    // Act
    const filestream = unit.getFileStream();
    // Assert
    let firstLine: string;
    let lastLine: string;
    for await (const line of filestream.readAsync()) {
      if (!firstLine) {
        firstLine = line;
      }
      lastLine = line;
    }
    expect(firstLine).toEqual(expectedFirstLine);
    expect(lastLine).toEqual(expectedLastLine);
  });
});
