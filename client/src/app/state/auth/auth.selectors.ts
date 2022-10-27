import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './auth.reducer';

export const selectState = (state: AppState) => state.user;
export const selectUserState = createSelector(
    selectState,
    (state: UserState) => state
);
export const selectUser = createSelector(
    selectState,
    (state: UserState) => state.user
);
export const selectUserStateStatus = createSelector(
    selectState,
    (state: UserState) => state.status
);
