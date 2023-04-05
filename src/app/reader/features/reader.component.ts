import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Book } from '../services/book';
import { ListItem } from '@reader/reader/interfaces/list-item.interface';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Dimensions } from '@reader/shared/resize-observable.directive';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { decreaseFontSize, increaseFontSize } from '@state/book/book.actions';
import { selectMetadata } from '@state/book/book.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'rd-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderComponent implements AfterViewInit {
  chapters: ListItem[] = [
    //TODO provide chapters
    { id: 0, name: 'Intro' },
    { id: 1, name: 'Second step' },
    { id: 2, name: 'Third step' },
  ];
  bookMetadata$: Observable<BookMetadata | null>;

  @ViewChild('bookContainer') bookContainer?: ElementRef;

  private bookSrc = 'assets/books/salinger_the_catcher_in_the_rye.epub'; //TODO provide static list of books and file loader
  readonly bookPlaceElementID = 'bookPlace';
  readonly pageButtonWidth = 80; //width in px

  constructor(private readonly book: Book, private readonly store: Store<AppState>) {
    this.bookMetadata$ = this.store.select(selectMetadata);
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

  private renderBook(): void {
    const width = (this.bookContainer?.nativeElement.offsetWidth ?? 1920) - 2 * this.pageButtonWidth;
    const height = this.bookContainer?.nativeElement.offsetHeight ?? 1010;
    this.book.render(this.bookSrc, this.bookPlaceElementID, width, height);
  }
}
