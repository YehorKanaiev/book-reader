import { createAction, props } from '@ngrx/store';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';
import { Chapter } from '@reader/reader/interfaces/chapter.interface';

export const setMetadata = createAction('[Reader page] Set book metadata', props<{ metadata: BookMetadata }>());

export const increaseFontSize = createAction('[Reader page] Increase font size');

export const decreaseFontSize = createAction('[Reader page] Decrease font size');

export const setCurrentChapter = createAction('[Reader page] Set current chapter', props<{ chapter: Chapter }>());

export const setChapters = createAction('[Reader page] Set book chapters', props<{ chapters: Chapter[] }>());
