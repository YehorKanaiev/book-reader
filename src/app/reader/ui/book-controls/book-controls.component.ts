import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'rd-book-controls',
  templateUrl: './book-controls.component.html',
  styleUrls: ['./book-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookControlsComponent {
  @Output()
  increaseFontSize = new EventEmitter<void>();

  @Output()
  decreaseFontSize = new EventEmitter<void>();
}
