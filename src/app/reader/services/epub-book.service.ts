import { Injectable, OnDestroy } from '@angular/core';
import { Book } from '@reader/reader/services/book';
import Epub, { Book as ParserBook } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectChapter, selectFontSize } from '@state/book/book.selectors';
import { AppState } from '@state/app.state';
import { setChapters, setMetadata } from '@state/book/book.actions';
import { Chapter } from '../interfaces/chapter.interface';

@Injectable()
export class EpubBookService extends Book implements OnDestroy {
  get isRendered(): Observable<boolean> {
    return this._isRendered.asObservable();
  }

  private book?: ParserBook;
  private rendition?: Rendition;
  private bookPlaceID?: string;
  private readonly _isRendered = new BehaviorSubject<boolean>(false);
  private readonly fontSize$: Observable<number>;
  private readonly chapter$: Observable<Chapter | null>;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>) {
    super();
    this.fontSize$ = this.store.select(selectFontSize);
    this.initFontSizeObserver();
    this.chapter$ = this.store.select(selectChapter);
    this.initChapterObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  render(sourceURL: string, elementID: string, width: number, height: number): Promise<void> {
    this.book = Epub(sourceURL);
    this.bookPlaceID = elementID;
    this.initMetadata();
    this.initChapters();
    this.rendition = this.book.renderTo(this.bookPlaceID, { width: `${width}px`, height: `${height}px` });

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

  private initFontSizeObserver(): void {
    this.fontSize$.pipe(takeUntil(this.destroy$)).subscribe(size => this.setFontSize(size));
  }

  private initChapterObserver(): void {
    this.chapter$
      .pipe(
        tap(chapter => {
          if (chapter) {
            this.rendition?.display(chapter.href);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initMetadata(): void {
    if (!this.book) {
      return;
    }

    this.book.loaded.metadata.then(allMetadata => {
      const metadata = {
        title: allMetadata?.title ?? '',
        author: allMetadata.creator ?? '',
        description: allMetadata.description ?? '',
        language: allMetadata.language ?? '',
      };

      this.store.dispatch(setMetadata({ metadata }));
    });
  }

  private initChapters(): void {
    if (!this.book) {
      return;
    }

    this.book.loaded.navigation.then(navigation => {
      const chapters = [...navigation.toc];
      this.store.dispatch(setChapters({ chapters }));
    });
  }

  private setFontSize(size: number): void {
    const sizeCss = `${size}px`;
    this.rendition?.themes?.fontSize(sizeCss);
  }
}
