import { BookMetadata } from './book-metadata.interface';
import { Chapter } from './chapter.interface';

export interface BookConfig {
  /**
   * A source for a book
   */
  sourceURL: string | ArrayBuffer;

  /**
   * ID of an element in DOM, where a book should be rendered
   */
  elementID: string;

  /**
   * Width of container element to be filled
   */
  width: number;

  /**
   * Height of container element to be filled
   */
  height: number;

  /**
   * A callback being called with chapters when book is initialized
   * @param chapters
   */
  onChaptersInit?: (chapters: Chapter[]) => void;

  /**
   * A callback being called with chapter when chapter is being opened
   * @param chapter
   */
  onChapterOpened?: (chapter: Chapter) => void;

  /**
   * A callback being called with book metadata when book is initialized
   * @param metadata
   */
  onMetadataInit?: (metadata: BookMetadata) => void;
}
