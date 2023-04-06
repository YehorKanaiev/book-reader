import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Chapter } from '@reader/reader/interfaces/chapter.interface';

export interface BookState {
  metadata: BookMetadata | null;
  fontSize: number;
  currentChapter: Chapter | null;
  chapters: Chapter[] | null;
}
