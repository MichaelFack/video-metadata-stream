import helloWorld from './hello-world'

// I like layering my tests with descriptive layers;
// For unittesting of a class: the classname >> the methodname >> case description (>> subtest variant)
// For unittesting of a function: the methodname >> the casename (>> subtest variant)
let unit: typeof helloWorld;
let console_mock: jest.MockedObject<typeof console>;

describe('helloWorld', () => {
  beforeEach(() => {
    unit = helloWorld
    console_mock = jest.mocked(console);
    console_mock.log = jest.fn()
  })

  test('logs expected string', () => {
    // Arrange - Nothing!
    // Act
    unit(console_mock)
    // Assert
    expect(console_mock.log).toHaveBeenCalledTimes(1)
    expect(console_mock.log).toHaveBeenCalledWith('Hello, World!')
  })
})
