import { Injectable } from '@angular/core';
import { Book } from '@reader/reader/services/book';
import Epub, { Book as ParserBook } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EpubBookService extends Book {
  private book?: ParserBook;
  private rendition?: Rendition;
  private bookPlaceID?: string;
  private readonly _isRendered = new BehaviorSubject<boolean>(false);
  get isRendered(): Observable<boolean> {
    return this._isRendered.asObservable();
  }

  constructor() {
    super();
  }

  render(sourceURL: string, elementID: string): Promise<void> {
    this.book = Epub(sourceURL);
    this.bookPlaceID = elementID;
    this.rendition = this.book.renderTo(this.bookPlaceID, { flow: 'scrolled-doc', width: 1000, height: 600 });
    return this.rendition.display().then(() => {
      this._isRendered.next(true);
    });
  }

  next(): Promise<void> {
    return this.rendition?.next() ?? Promise.resolve(undefined);
  }

  previous(): Promise<void> {
    return this.rendition?.prev() ?? Promise.resolve(undefined);
  }

  openPage(pageNumber: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  setFontSize(size: number): Promise<void> {
    return Promise.resolve(undefined);
  }
}
