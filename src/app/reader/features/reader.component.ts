import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Book } from '../services/book';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Dimensions } from '@reader/shared/resize-observable.directive';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { decreaseFontSize, increaseFontSize } from '@state/book/book.actions';
import { selectChapter, selectChapters, selectMetadata } from '@state/book/book.selectors';
import { Observable } from 'rxjs';
import { Chapter } from '../interfaces/chapter.interface';

@Component({
  selector: 'rd-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderComponent implements AfterViewInit {
  bookMetadata$: Observable<BookMetadata | null>;
  chapter$: Observable<Chapter | null>;
  chapters$: Observable<Chapter[] | null>;

  @ViewChild('bookContainer') bookContainer?: ElementRef;

  private bookSrc = 'assets/books/salinger_the_catcher_in_the_rye.epub'; //TODO provide static list of books and file loader
  readonly bookPlaceElementID = 'bookPlace';
  readonly pageButtonWidth = 80; //width in px

  constructor(private readonly book: Book, private readonly store: Store<AppState>) {
    this.bookMetadata$ = this.store.select(selectMetadata);
    this.chapter$ = this.store.select(selectChapter);
    this.chapters$ = this.store.select(selectChapters);
  }

  ngAfterViewInit(): void {
    this.renderBook();
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

  private renderBook(): void {
    const width = (this.bookContainer?.nativeElement.offsetWidth ?? 1920) - 2 * this.pageButtonWidth;
    const height = this.bookContainer?.nativeElement.offsetHeight ?? 1010;
    this.book.render(this.bookSrc, this.bookPlaceElementID, width, height);
  }
}
