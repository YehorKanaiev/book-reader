import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Book } from '../services/book';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Dimensions } from '@reader/shared/resize-observable.directive';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { decreaseFontSize, increaseFontSize } from '@state/book/book.actions';
import { selectChapter, selectChapters, selectMetadata } from '@state/book/book.selectors';
import { debounceTime, Observable, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import { Chapter } from '../interfaces/chapter.interface';
import { ActivatedRoute, Router } from '@angular/router';

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

  @ViewChild('bookContainer') bookContainer?: ElementRef;

  private readonly bookSrc$ = new ReplaySubject<string | ArrayBuffer>(1);
  readonly bookPlaceElementID = 'bookPlace';
  readonly pageButtonWidth = 80; //width in px
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

    //TODO create methods to handle state and queryParams
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      const state = navigation.extras.state as { book?: ArrayBuffer };

      if (state && state.book) {
        this.bookSrc$.next(state.book);
      }
    }

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

  ngAfterViewInit(): void {
    if (!this.bookSrc$) {
      //TODO navigate to home;
      return;
    }

    //TODO without debounce time it doesnt work for the first time, but works when reloading
    this.bookSrc$.pipe(debounceTime(0), takeUntil(this.destroy$)).subscribe(src => this.renderBook(src));
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

  private renderBook(source: string | ArrayBuffer): void {
    const width = (this.bookContainer?.nativeElement.offsetWidth ?? 1920) - 2 * this.pageButtonWidth;
    const height = this.bookContainer?.nativeElement.offsetHeight ?? 1010;
    this.book.render(source, this.bookPlaceElementID, width, height);
  }
}
