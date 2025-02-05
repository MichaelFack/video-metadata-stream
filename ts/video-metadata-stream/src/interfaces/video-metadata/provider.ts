import { ReadStream } from "fs";
import { IFileStream } from "./framework/filestream";

export interface IProvider {
  getFileStream(): IFileStream;
}
