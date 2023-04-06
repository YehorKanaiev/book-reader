import { AppState } from '@reader/state/app.state';
import { createSelector } from '@ngrx/store';
import { BookState } from '@state/book/book.state';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Chapter } from '@reader/reader/interfaces/chapter.interface';

export const selectBook = (state: AppState): BookState => state.book;

export const selectMetadata = createSelector(selectBook, (state: BookState): BookMetadata | null => state.metadata);

export const selectFontSize = createSelector(selectBook, (state: BookState): number => state.fontSize);

export const selectChapter = createSelector(selectBook, (state: BookState): Chapter | null => state.currentChapter);

export const selectChapters = createSelector(selectBook, (state: BookState): Chapter[] | null => state.chapters);
