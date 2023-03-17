import { Observable } from 'rxjs';

export abstract class Book {
  /**
   * Emits true when a book is loaded, otherwise emits false
   */
  abstract get isRendered(): Observable<boolean>;

  /**
   * Creates a book and adds it to an element in DOM
   * @param sourceURL is a source where a book is stored
   * @param elementID is id of an element in DOM, where a book should be rendered
   */
  abstract render(sourceURL: string, elementID: string): Promise<void>;

  /**
   * Go to the previous page
   */
  abstract previous(): Promise<void>;

  /**
   * Go to the next page
   */
  abstract next(): Promise<void>;

  /**
   * Open a specific page by its number
   * @param pageNumber is a number of a page inside the book
   */
  abstract openPage(pageNumber: number): Promise<void>;

  /**
   * Changes font size of a book
   * @param size font size
   */
  abstract setFontSize(size: number): Promise<void>;
}
