import { photoReducer, initialState } from './photo.reducer';

describe('Photo Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = photoReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
