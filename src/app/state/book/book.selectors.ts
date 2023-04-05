import { AppState } from '@reader/state/app.state';
import { createSelector } from '@ngrx/store';
import { BookState } from '@state/book/book.state';

export const selectBook = (state: AppState): BookState => state.book;

export const selectFontSize = createSelector(selectBook, (state: BookState) => state.fontSize);
