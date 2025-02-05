import { IProvider } from "../interfaces/video-metadata/provider";
import path from "path";
import { IFileStream } from "../interfaces/framework/filestream";
import { FileStream } from "../framework/filestream";
import { ILogger } from "../misc/logger";

export class Provider implements IProvider {
  private logger: ILogger;
  
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  getFileStream(): IFileStream {
    const filepath = path.join(__dirname, '../../../../docs/tv2-video-metadata-ingest.txt') 
    this.logger.debug('Returning filestream for: ' + filepath)
    return new FileStream(filepath);
  }
}
