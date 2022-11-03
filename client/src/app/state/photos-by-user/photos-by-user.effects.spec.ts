import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PhotosByUserEffects } from './photos-by-user.effects';

describe('PhotosByUserEffects', () => {
  let actions$: Observable<any>;
  let effects: PhotosByUserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotosByUserEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(PhotosByUserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
