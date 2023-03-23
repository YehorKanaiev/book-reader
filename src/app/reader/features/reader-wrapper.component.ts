import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Book } from '../services/book';
import { ListItem } from '@reader/reader/interfaces/list-item.interface';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Dimensions } from '@reader/shared/resize-observable.directive';

@Component({
  selector: 'rd-reader-wrapper',
  templateUrl: './reader-wrapper.component.html',
  styleUrls: ['./reader-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderWrapperComponent implements OnInit {
  chapters: ListItem[] = [
    //TODO provide chapters
    { id: 0, name: 'Intro' },
    { id: 1, name: 'Second step' },
    { id: 2, name: 'Third step' },
  ];

  get title(): string {
    return this.bookMetadata?.title ?? '';
  }

  private bookSrc = 'assets/books/salinger_the_catcher_in_the_rye.epub'; //TODO provide static list of books and file loader
  private bookMetadata?: BookMetadata | null;
  readonly bookPlaceElementID = 'bookPlace';
  readonly pageButtonWidth = 80; //width in px

  constructor(private readonly book: Book) {}

  ngOnInit(): void {
    this.book.render(this.bookSrc, this.bookPlaceElementID);
    this.book.metadata.then(metadata => (this.bookMetadata = metadata));
  }

  previousPage(): void {
    this.book.previous();
  }

  nextPage(): void {
    this.book.next();
  }

  increaseFontSize(): void {
    const fontSize = this.book.fontSize;
    this.book.setFontSize(fontSize + 1);
  }

  decreaseFontSize(): void {
    const fontSize = this.book.fontSize;
    this.book.setFontSize(fontSize - 1);
  }

  resizeBook({ width, height }: Dimensions): void {
    const bookWidth = width - 2 * this.pageButtonWidth;
    this.book.resize(bookWidth, height);
  }
}
