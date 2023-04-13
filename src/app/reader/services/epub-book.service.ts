import { Injectable, OnDestroy } from '@angular/core';
import { Book } from '@reader/reader/services/book';
import Epub, { Book as ParserBook } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectFontSize } from '@state/book/book.selectors';
import { AppState } from '@state/app.state';
import { setChapters, setCurrentChapter, setMetadata } from '@state/book/book.actions';
import { Chapter } from '../interfaces/chapter.interface';
import { EpubJSHelperService } from '@reader/reader/services/epub-jshelper.service';
import { Theme } from '@reader/core/themes.enum';
import { selectTheme } from '@state/theme/theme.selectors';

@Injectable()
export class EpubBookService extends Book implements OnDestroy {
  get isRendered(): Observable<boolean> {
    return this._isRendered.asObservable();
  }

  private book?: ParserBook;
  private rendition?: Rendition;
  private bookPlaceID?: string;
  private theme = Theme.Light;
  private readonly _isRendered = new BehaviorSubject<boolean>(false);
  private readonly fontSize$: Observable<number>;
  private readonly theme$: Observable<Theme>;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>, private readonly helper: EpubJSHelperService) {
    super();
    this.fontSize$ = this.store.select(selectFontSize);
    this.initFontSizeObserver();
    this.theme$ = this.store.select(selectTheme);
    this.initThemeObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  render(sourceURL: string | ArrayBuffer, elementID: string, width: number, height: number): Promise<void> {
    this.book = Epub(sourceURL);
    this.bookPlaceID = elementID;
    this.initMetadata();
    this.initChapters();
    this.rendition = this.book.renderTo(this.bookPlaceID, { width: `${width}px`, height: `${height}px` });
    this.initChapterObserver();
    this.registerThemes();
    this.rendition.themes.select(this.theme);

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

  openChapter(chapter: Chapter): Promise<void> {
    if (!this.rendition) {
      return Promise.resolve();
    }

    return this.rendition?.display(chapter.href);
  }

  private initFontSizeObserver(): void {
    this.fontSize$.pipe(takeUntil(this.destroy$)).subscribe(size => this.setFontSize(size));
  }

  private registerThemes(): void {
    if (!this.rendition) {
      return;
    }

    this.rendition.themes.register(Theme.Dark, {
      body: { 'background-color': '#303030', color: 'white' },
    });

    this.rendition.themes.register(Theme.Light, {});
  }

  private initThemeObserver(): void {
    this.theme$
      .pipe(
        tap(theme => {
          if (!this.rendition || !this.book) {
            return;
          }

          this.rendition.themes.select(theme);
          this.rendition.start();
        }),
        tap(theme => (this.theme = theme)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initChapterObserver(): void {
    if (!this.rendition) {
      return;
    }

    this.rendition.on('rendered', () => {
      if (!this.book || !this.rendition) {
        return;
      }

      const location = this.rendition.currentLocation();
      const chapter = this.helper.getChapter(this.book, location);

      this.store.dispatch(setCurrentChapter({ chapter: chapter as Chapter }));
    });
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

      this.store.dispatch(setChapters({ chapters: chapters as Chapter[] }));
    });
  }

  private setFontSize(size: number): void {
    const sizeCss = `${size}px`;
    this.rendition?.themes?.fontSize(sizeCss);
  }
}
