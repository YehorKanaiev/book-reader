import { BookState } from '@reader/state/book/book.state';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { decreaseFontSize, increaseFontSize, setMetadata } from '@reader/state/book/book.actions';

const initialState: BookState = {
  metadata: null,
  fontSize: 16,
};

export const bookReducer: ActionReducer<BookState> = createReducer(
  initialState,
  on(setMetadata, (state, { metadata }): BookState => ({ ...state, metadata: metadata })),
  on(increaseFontSize, (state): BookState => ({ ...state, fontSize: state.fontSize + 1 })),
  on(decreaseFontSize, (state): BookState => ({ ...state, fontSize: state.fontSize - 1 }))
);
