import { delay } from "./time";

describe('delay', () => {
  test('should return { success: true } if time passed', async () => {
    // Arrange
    const expectedResult = { success: true };
    const unit = delay(100);
    // Act
    const result = await unit.promise;
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('should return { success: false } if cancelled', async () => {
    // Arrange
    const expectedResult = { success: false };
    const unit = delay(100);
    await unit.cancelAsync()
    // Act
    const result = await unit.promise;
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
