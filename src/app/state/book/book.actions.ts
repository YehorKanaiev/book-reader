import { createAction, props } from '@ngrx/store';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';

export const setMetadata = createAction('[Book page] Set book metadata', props<{ metadata: BookMetadata }>());

export const increaseFontSize = createAction('[Book page] Increase font size');

export const decreaseFontSize = createAction('[Book page] Decrease font size');
