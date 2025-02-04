import { TimeInS } from "../misc/time"

export interface VideoMetadata {
  id: string // is the UUID of the publication
  title: string // is the title of the video
  provider: string // is the company providing the publication.
  encodingTime: TimeInS // indicates how long it takes to encode the video in seconds.
  publicationTimeout: TimeInS /* indicates the maximum time a publication is allowed to process 
  from the encoding is started until the content is published on TV 2 PLAY, also in 
  seconds. If this time is exceeded, the publication is considered a publication failure. */
}
