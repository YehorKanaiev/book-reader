import { Observable } from 'rxjs';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';

export abstract class Book {
  /**
   * Returns books metadata, such as title, author, etc.
   */
  abstract get metadata(): Promise<BookMetadata | null>;

  /**
   * Emits true when a book is loaded, otherwise emits false
   */
  abstract get isRendered(): Observable<boolean>;

  /**
   * Returns the current font size
   */
  abstract get fontSize(): number;

  /**
   * Creates a book and adds it to an element in DOM
   * @param sourceURL is a source where a book is stored
   * @param elementID is id of an element in DOM, where a book should be rendered
   */
  abstract render(sourceURL: string, elementID: string): Promise<void>;

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
   * Changes font size of a book
   * @param size font size
   */
  abstract setFontSize(size: number): Promise<void>;
}
