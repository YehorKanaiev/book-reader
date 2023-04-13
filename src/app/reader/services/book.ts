import { Chapter } from '@reader/reader/interfaces/chapter.interface';
import { Theme } from '@reader/core/themes.enum';
import { BookConfig } from '@reader/reader/interfaces/book-config.interface';

export abstract class Book {
  /**
   * Creates a book and adds it to an element in DOM
   * @param config
   */
  abstract render(config: BookConfig): Promise<void>;

  /**
   * Changes the size of book's container
   * @param width width in px
   * @param height height in px
   */
  abstract resize(width: number, height: number): void;

  /**
   * Go to the previous page
   */
  abstract previous(): Promise<void>;

  /**
   * Go to the next page
   */
  abstract next(): Promise<void>;

  /**
   * Open chapter of a book
   * @param chapter
   */
  abstract openChapter(chapter: Chapter): Promise<void>;

  /**
   * Set theme, so that book can adapt inner elements to application styles
   * @param theme
   */
  abstract setTheme(theme: Theme): void;

  /**
   * Set font size for text in a book
   * @param size font size in px
   */
  abstract setFontSize(size: number): void;
}
