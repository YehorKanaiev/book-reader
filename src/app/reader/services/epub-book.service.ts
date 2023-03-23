import { Injectable } from '@angular/core';
import { Book } from '@reader/reader/services/book';
import Epub, { Book as ParserBook } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { PackagingMetadataObject } from 'epubjs/types/packaging';

@Injectable()
export class EpubBookService extends Book {
  get metadata(): Promise<BookMetadata | null> {
    if (!this._metadata) {
      return Promise.resolve(null);
    }

    return this._metadata.then(metadata => {
      return {
        title: metadata?.title ?? '',
        author: metadata.creator ?? '',
        description: metadata.description ?? '',
        language: metadata.language ?? '',
      };
    });
  }
  private _metadata?: Promise<PackagingMetadataObject>;

  get isRendered(): Observable<boolean> {
    return this._isRendered.asObservable();
  }
  private readonly _isRendered = new BehaviorSubject<boolean>(false);

  get fontSize(): number {
    return this._fontSize;
  }
  private _fontSize = 16;

  private book?: ParserBook;
  private rendition?: Rendition;
  private bookPlaceID?: string;

  constructor() {
    super();
  }

  render(sourceURL: string, elementID: string): Promise<void> {
    this.book = Epub(sourceURL);
    this.bookPlaceID = elementID;
    this._metadata = this.book.loaded.metadata;
    this.rendition = this.book.renderTo(this.bookPlaceID, { width: '100%', height: '100%' });
    return this.rendition.display().then(() => {
      this._isRendered.next(true);
    });
  }

  resize(width: number, height: number): void {
    this.rendition?.resize(width, height);
  }

  next(): Promise<void> {
    return this.rendition?.next() ?? Promise.resolve(undefined);
  }

  previous(): Promise<void> {
    return this.rendition?.prev() ?? Promise.resolve(undefined);
  }

  setFontSize(size: number): Promise<void> {
    const sizeCss = `${size}px`;
    this.rendition?.themes?.fontSize(sizeCss);
    this._fontSize = size;

    return Promise.resolve(undefined);
  }
}
