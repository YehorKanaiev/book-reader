import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Book } from '../services/book';

@Component({
  selector: 'rd-reader-wrapper',
  templateUrl: './reader-wrapper.component.html',
  styleUrls: ['./reader-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderWrapperComponent {
  readonly bookPlaceID = 'bookPlace';

  constructor(private readonly book: Book) {
    book.render('assets/books/salinger_the_catcher_in_the_rye.epub', this.bookPlaceID);
  }

  previousPage(): void {
    this.book.previous();
  }

  nextPage(): void {
    this.book.next();
  }
}
