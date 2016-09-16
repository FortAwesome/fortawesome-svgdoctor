import some from 'lodash-node/modern/collection/some';
import { mapElements } from './utils';

export default {
  strokedPaths(svg) {
    const strokesPresent = mapElements(svg, { type: 'path' }, elem =>
      !!(elem.attrs.stroke && elem.attrs['stroke-width'])
    );

    return some(strokesPresent);
  },
};
