export interface IFileStream {
  readAsync(): AsyncIterable<string>
}
