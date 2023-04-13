import { createAction, props } from '@ngrx/store';
import { Theme } from '@reader/core/themes.enum';

export const setTheme = createAction('[Reader page] Set theme', props<{ theme: Theme }>());
