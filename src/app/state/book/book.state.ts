import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';

export interface BookState {
  metadata: BookMetadata | null;
  fontSize: number;
}
