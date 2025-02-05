import { Logger, LogLevel } from "./logger";
import { Mutex } from "./mutex";
import { delay, TimeInMS } from "./time";

describe('mutex', () => {
  let unit: Mutex;
  
  beforeEach(() => {
    const logger = new Logger(LogLevel.INFO, 'Mutex');
    unit = new Mutex(logger);
  })

  describe('doWorkAsync', () => {
    test('callback should be invoked', async () => {
      // Arrange
      const callbackMock: () => Promise<void> = jest.fn();
      // Act
      await unit.doWorkAsync<void>(callbackMock);
      // Assert
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });

    test('callback should return value', async () => {
      // Arrange
      const expectedResult = true;
      const callbackMock: () => Promise<boolean> = jest.fn().mockReturnValue(expectedResult);
      // Act
      const result = await unit.doWorkAsync<boolean>(callbackMock);
      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should cause sequential behavior - sequential awaiting', async () => {
      // Arrange
      let completionOrder: string[] = []
      const callbackMocks: (() => Promise<void>)[] = [
        getDelayedPromise(10, completionOrder, 'A'),
        getDelayedPromise(500, completionOrder, 'B'),
        getDelayedPromise(100, completionOrder, 'C'),
      ]
      // Act
      const aPromise = unit.doWorkAsync<void>(callbackMocks[0]);
      const bPromise = unit.doWorkAsync<void>(callbackMocks[1]);
      const cPromise = unit.doWorkAsync<void>(callbackMocks[2]);
      await aPromise;
      await bPromise;
      await cPromise;
      // Assert
      expect(completionOrder).toEqual(['A', 'B', 'C']);
    });

    test('should cause sequential behavior - reverse sequential awaiting', async () => {
      // Arrange
      let completionOrder: string[] = []
      const callbackMocks: (() => Promise<void>)[] = [
        getDelayedPromise(10, completionOrder, 'A'),
        getDelayedPromise(500, completionOrder, 'B'),
        getDelayedPromise(100, completionOrder, 'C'),
      ]
      // Act
      const aPromise = unit.doWorkAsync<void>(callbackMocks[0]);
      const bPromise = unit.doWorkAsync<void>(callbackMocks[1]);
      const cPromise = unit.doWorkAsync<void>(callbackMocks[2]);
      await cPromise;
      await bPromise;
      await aPromise;
      // Assert
      expect(completionOrder).toEqual(['A', 'B', 'C']);
    });
    
    test('should cause sequential behavior - shuffled awaiting', async () => {
      // Arrange
      let completionOrder: string[] = []
      const callbackMocks: (() => Promise<void>)[] = [
        getDelayedPromise(10, completionOrder, 'A'),
        getDelayedPromise(500, completionOrder, 'B'),
        getDelayedPromise(100, completionOrder, 'C'),
      ]
      // Act
      const aPromise = unit.doWorkAsync<void>(callbackMocks[0]);
      const bPromise = unit.doWorkAsync<void>(callbackMocks[1]);
      const cPromise = unit.doWorkAsync<void>(callbackMocks[2]);
      await bPromise;
      await cPromise;
      await aPromise;
      // Assert
      expect(completionOrder).toEqual(['A', 'B', 'C']);
    });
  });
});

function getDelayedPromise(delayInMS: TimeInMS, completionOrder: string[], identity: string): () => Promise<void> {
  return () => new Promise<void>((resolve) => {
    setTimeout(resolve, delayInMS);
  }).then(() => { completionOrder.push(identity) })
}
