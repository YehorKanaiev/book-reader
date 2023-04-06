import { BookState } from '@reader/state/book/book.state';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { decreaseFontSize, increaseFontSize, setChapters, setCurrentChapter, setMetadata } from '@reader/state/book/book.actions';

const initialState: BookState = {
  metadata: null,
  fontSize: 16,
  currentChapter: null,
  chapters: null,
};

export const bookReducer: ActionReducer<BookState> = createReducer(
  initialState,
  on(setMetadata, (state, { metadata }): BookState => ({ ...state, metadata: metadata })),
  on(increaseFontSize, (state): BookState => ({ ...state, fontSize: state.fontSize + 1 })),
  on(decreaseFontSize, (state): BookState => ({ ...state, fontSize: state.fontSize - 1 })),
  on(setCurrentChapter, (state, { chapter }): BookState => ({ ...state, currentChapter: chapter })),
  on(setChapters, (state, { chapters }): BookState => ({ ...state, chapters: chapters }))
);
