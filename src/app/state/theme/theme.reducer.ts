import { ActionReducer, createReducer, on } from '@ngrx/store';
import { ThemeState } from '@state/theme/theme.state';
import { Theme } from '@reader/core/themes.enum';
import { setTheme } from '@state/theme/theme.actions';

const initialState: ThemeState = {
  theme: Theme.Light,
};

export const themeReducer: ActionReducer<ThemeState> = createReducer(
  initialState,
  on(setTheme, (state, { theme }): ThemeState => ({ ...state, theme }))
);
