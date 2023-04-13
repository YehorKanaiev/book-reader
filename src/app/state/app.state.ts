import { BookState } from '@state/book/book.state';
import { ThemeState } from '@state/theme/theme.state';

export interface AppState {
  book: BookState;
  theme: ThemeState;
}
