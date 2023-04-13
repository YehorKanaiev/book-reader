import { createSelector } from '@ngrx/store';
import { ThemeState } from '@state/theme/theme.state';
import { AppState } from '@state/app.state';
import { Theme } from '@reader/core/themes.enum';

export const selectThemeState = (state: AppState): ThemeState => state.theme;

export const selectTheme = createSelector(selectThemeState, (state: ThemeState): Theme => state.theme);
