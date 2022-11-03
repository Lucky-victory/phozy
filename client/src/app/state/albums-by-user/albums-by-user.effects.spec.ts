import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AlbumsByUserEffects } from './albums-by-user.effects';

describe('AlbumsByUserEffects', () => {
  let actions$: Observable<any>;
  let effects: AlbumsByUserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlbumsByUserEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(AlbumsByUserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
