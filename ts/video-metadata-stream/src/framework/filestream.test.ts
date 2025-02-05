import { FileStream } from "./filestream";
import * as path from 'path'

describe('filestream', () => {
  let unit: FileStream;

  beforeEach(() => {
    const pathToTestFile = path.join(__dirname, '../../../tests/file.txt');
    unit = new FileStream(pathToTestFile);
  });

  describe('readAsync', () => {
    test('returns iterator of file', async () => {
      const list: string[] = [];
      // Act
      const iter = unit.readAsync()
      // Assert
      for await (const s of iter) {
        list.push(s)
      }
      expect(list).toEqual(['a', 'b', 'c'])
    });
  });
});
