import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './auth.reducer';

export const selectState = (state: AppState) => state.user;
export const selectUserState = createSelector(selectState, (state: UserState) => state);