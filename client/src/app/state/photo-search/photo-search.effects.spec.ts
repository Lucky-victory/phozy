import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PhotoSearchEffects } from './photo-search.effects';

describe('PhotoSearchEffects', () => {
    let actions$: Observable<any>;
    let effects: PhotoSearchEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PhotoSearchEffects, provideMockActions(() => actions$)],
        });

        effects = TestBed.inject(PhotoSearchEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
