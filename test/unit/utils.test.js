import { expect } from 'chai';

import { elementMatches } from '../../src/utils';

describe('Utils', function () {
  describe('elementMatches', function () {
    it('will match if no options specified', function () {
      expect(elementMatches('path', {})).to.eq(true);
    });

    it('will not match by type', function () {
      expect(elementMatches('path', { type: 'ellipsis' })).to.eq(false);
    });

    it('will match by type', function () {
      expect(elementMatches('path', { type: 'path' })).to.eq(true);
    });

    it('will not match by shape', function () {
      expect(elementMatches('g', { anyShape: true })).to.eq(false);
    });

    it('will match by shape', function () {
      expect(elementMatches('circle', { anyShape: true })).to.eq(true);
    });
  });
});
