import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Book } from '../services/book';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Dimensions } from '@reader/shared/resize-observable.directive';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { decreaseFontSize, increaseFontSize, setChapters, setCurrentChapter, setMetadata } from '@state/book/book.actions';
import { selectChapter, selectChapters, selectFontSize, selectMetadata } from '@state/book/book.selectors';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Chapter } from '../interfaces/chapter.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutingPaths } from '@reader/app-routing-paths.enum';
import { Theme } from '@reader/core/themes.enum';
import { setTheme } from '@state/theme/theme.actions';
import { selectTheme } from '@state/theme/theme.selectors';
import { BookConfig } from '@reader/reader/interfaces/book-config.interface';

@Component({
  selector: 'rd-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderComponent implements AfterViewInit, OnDestroy {
  bookMetadata$: Observable<BookMetadata | null>;
  chapter$: Observable<Chapter | null>;
  chapters$: Observable<Chapter[] | null>;
  theme$: Observable<Theme>;
  fontSize$: Observable<number>;

  @ViewChild('bookContainer') bookContainer?: ElementRef;

  private readonly bookSrc$ = new BehaviorSubject<string | ArrayBuffer | null>(null);
  readonly bookPlaceElementID = 'bookPlace';
  readonly pageButtonWidth = 80; //width in px
  private readonly defaultScreenWidth = 1980; //px
  private readonly defaultScreenHeight = 1010; //px
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly book: Book,
    private readonly store: Store<AppState>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.bookMetadata$ = this.store.select(selectMetadata);
    this.chapter$ = this.store.select(selectChapter);
    this.chapters$ = this.store.select(selectChapters);
    this.theme$ = this.store.select(selectTheme);
    this.fontSize$ = this.store.select(selectFontSize);
    this.initFontSizeObserver();
    this.initThemeObserver();
    this.initQueryParamsObserver();
    this.initRouterStateObserver();
  }

  ngAfterViewInit(): void {
    this.initBookSourceObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  previousPage(): void {
    this.book.previous();
  }

  nextPage(): void {
    this.book.next();
  }

  increaseFontSize(): void {
    this.store.dispatch(increaseFontSize());
  }

  decreaseFontSize(): void {
    this.store.dispatch(decreaseFontSize());
  }

  resizeBook({ width, height }: Dimensions): void {
    const bookWidth = width - 2 * this.pageButtonWidth;
    this.book.resize(bookWidth, height);
  }

  goToChapter(chapter: Chapter): void {
    this.book.openChapter(chapter);
  }

  goToHome(): void {
    this.router.navigate([AppRoutingPaths.Home]);
  }

  changeTheme(theme: Theme): void {
    this.store.dispatch(setTheme({ theme }));
  }

  private initFontSizeObserver(): void {
    this.fontSize$.pipe(takeUntil(this.destroy$)).subscribe(size => this.book.setFontSize(size));
  }

  private initThemeObserver(): void {
    this.theme$
      .pipe(
        tap(theme => this.book.setTheme(theme)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initQueryParamsObserver(): void {
    this.activatedRoute.queryParams
      .pipe(
        tap(params => {
          if (params['src']) {
            this.bookSrc$.next(decodeURIComponent(params['src']));
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initRouterStateObserver(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      const state = navigation.extras.state as { book?: ArrayBuffer };

      if (state && state.book) {
        this.bookSrc$.next(state.book);
      }
    }
  }

  private initBookSourceObserver(): void {
    if (!this.bookSrc$.value) {
      console.error('There is no book to open');
      this.router.navigate([AppRoutingPaths.Home]);

      return;
    }

    this.bookSrc$.pipe(takeUntil(this.destroy$)).subscribe(src => {
      if (src) {
        this.renderBook(src);
      }
    });
  }

  private renderBook(sourceURL: string | ArrayBuffer): void {
    const width = (this.bookContainer?.nativeElement.offsetWidth ?? this.defaultScreenWidth) - 2 * this.pageButtonWidth;
    const height = this.bookContainer?.nativeElement.offsetHeight ?? this.defaultScreenHeight;
    const onChaptersInit = (chapters: Chapter[]): void => this.store.dispatch(setChapters({ chapters: chapters as Chapter[] }));
    const onChapterOpened = (chapter: Chapter): void => this.store.dispatch(setCurrentChapter({ chapter: chapter as Chapter }));
    const onMetadataInit = (metadata: BookMetadata): void => this.store.dispatch(setMetadata({ metadata }));

    const config: BookConfig = {
      sourceURL,
      elementID: this.bookPlaceElementID,
      width,
      height,
      onChaptersInit,
      onChapterOpened,
      onMetadataInit,
    };

    this.book.render(config);
  }
}
