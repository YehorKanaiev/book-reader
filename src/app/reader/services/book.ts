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
   * @param width is width of container element to be filled
   * @param height is height of container element to be filled
   */
  abstract render(sourceURL: string, elementID: string, width: number, height: number): Promise<void>;

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
}
