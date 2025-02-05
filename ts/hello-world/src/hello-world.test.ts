import helloWorld from './hello-world'

// I like layering my tests with descriptive layers;
// For unittesting of a class: the classname >> the methodname >> case description (>> subtest variant)
// For unittesting of a function: the methodname >> the casename (>> subtest variant)
let unit: typeof helloWorld;
let consoleMock: jest.MockedObject<typeof console>;

describe('helloWorld', () => {
  beforeEach(() => {
    unit = helloWorld
    consoleMock = jest.mocked(console);
    consoleMock.log = jest.fn()
  })

  test('logs expected string', () => {
    // Arrange - Nothing!
    // Act
    unit(consoleMock)
    // Assert
    expect(consoleMock.log).toHaveBeenCalledTimes(1)
    expect(consoleMock.log).toHaveBeenCalledWith('Hello, World!')
  })
})
