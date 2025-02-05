import { createReadStream } from "fs";
import { IFileStream } from "../interfaces/framework/filestream";
import { createInterface } from "readline";

export class FileStream implements IFileStream {
  private filepath: string;
  constructor(filepath: string) {
    this.filepath = filepath;
  }

  readAsync(): AsyncIterable<string> {
    const filestream = createReadStream(this.filepath);
    const int = createInterface({
      input: filestream,
      crlfDelay: Infinity
    });
    return int[Symbol.asyncIterator]()
  }
}
