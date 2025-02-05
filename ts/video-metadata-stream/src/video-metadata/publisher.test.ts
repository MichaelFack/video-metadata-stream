import { getVideoMetadata } from "../../tests/utility";
import { Logger, LogLevel } from "../misc/logger";
import { Cancelation, CancelationCallback, MsPrSecond } from "../misc/time";
import { Publisher } from "./publisher";

describe('publisher', () => {
  let pseudoRandomNumberBetween0and1: number;
  let unit: Publisher;
  let minDelayInS: number;
  let maxDelayInS: number;

  beforeEach(() => {
    minDelayInS = 0.5;
    maxDelayInS = 1;
    const logger = new Logger(LogLevel.DEBUG, 'Publisher')
    unit = new Publisher(minDelayInS, maxDelayInS, logger, () => {
      return pseudoRandomNumberBetween0and1;
    })
  });

  describe('publishAsync', () => {
    test.each([
      { numberBetween0and1: 0.1 },
      { numberBetween0and1: 0.2 },
      { numberBetween0and1: 0.5 },
      { numberBetween0and1: 0.8 },
      { numberBetween0and1: 0.9 },
    ])('Should delay expected amount', async (args: { numberBetween0and1: number }) => {
      // Arrange
      const deltaInMS = 10;
      const data = getVideoMetadata();
      pseudoRandomNumberBetween0and1 = args.numberBetween0and1;
      const expectedTimeElapsed = (args.numberBetween0and1 * (maxDelayInS * MsPrSecond - minDelayInS * MsPrSecond + 1) + minDelayInS * MsPrSecond)
      const before = new Date().getTime();
      // Act
      await unit.publishAsync(data, async (cancelation: Cancelation) => {})
      // Assert
      const after = new Date().getTime();
      expect(before + expectedTimeElapsed).toBeLessThan(after + deltaInMS)
      expect(before + expectedTimeElapsed).toBeGreaterThan(after - deltaInMS)
    });

    test('Should return almost immediately when cancelled immediately', async () => {
      // Arrange
      const deltaInMS = 10;
      const expectedTimeElapsed = 0
      const data = getVideoMetadata();
      pseudoRandomNumberBetween0and1 = 0.5;
      let cancel: Cancelation;
      const before = new Date().getTime();
      // Act
      const publishPromise = unit.publishAsync(data, async (cancelation: Cancelation) => { cancel = cancelation })
      await cancel();
      await publishPromise;
      // Assert
      const after = new Date().getTime();
      expect(before + expectedTimeElapsed).toBeLessThan(after + deltaInMS)
      expect(before + expectedTimeElapsed).toBeGreaterThan(after - deltaInMS)
    });
  });
});
