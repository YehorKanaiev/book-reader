import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Theme } from '@reader/core/themes.enum';

@Component({
  selector: 'rd-book-controls',
  templateUrl: './book-controls.component.html',
  styleUrls: ['./book-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookControlsComponent {
  @Input()
  set theme(theme: Theme | null) {
    if (theme !== null) {
      this._theme = theme;
    }
  }

  @Output()
  themeChanged = new EventEmitter<Theme>();

  @Output()
  increaseFontSize = new EventEmitter<void>();

  @Output()
  decreaseFontSize = new EventEmitter<void>();

  get isLightTheme(): boolean {
    return this._theme === Theme.Light;
  }

  private _theme = Theme.Light;

  setDarkTheme(): void {
    this.themeChanged.emit(Theme.Dark);
  }

  setLightTheme(): void {
    this.themeChanged.emit(Theme.Light);
  }
}
