import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PhotoEffects } from './photo.effects';

describe('PhotoEffects', () => {
  let actions$: Observable<any>;
  let effects: PhotoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(PhotoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
