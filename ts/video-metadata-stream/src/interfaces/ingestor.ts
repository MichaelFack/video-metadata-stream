import { IFileStream } from './framework/filestream';

export interface IIngestor {
  ingestAsync(filestream: IFileStream): Promise<void>
}
