import { BookState } from '@reader/state/book/book.state';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { decreaseFontSize, increaseFontSize } from '@reader/state/book/book.actions';

const initialState: BookState = {
  fontSize: 16,
};

export const bookReducer: ActionReducer<BookState> = createReducer(
  initialState,
  on(increaseFontSize, (state): BookState => ({ ...state, fontSize: state.fontSize + 1 })),
  on(decreaseFontSize, (state): BookState => ({ ...state, fontSize: state.fontSize - 1 }))
);
