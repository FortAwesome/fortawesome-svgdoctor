import some from 'lodash-node/modern/collection/some';
import sum from 'lodash-node/modern/math/sum';
import svgPathParser from 'svg-path-parser';
import { mapElements } from './utils';

export default {
  strokedPaths(svg) {
    const strokesPresent = mapElements(svg, { type: 'path' }, (elem) => {
      return !!(elem.attrs.stroke && elem.attrs['stroke-width']);
    });

    return some(strokesPresent);
  },

  pointCount(svg) {
    const counts = mapElements(svg, { type: 'path' }, (elem) => {
      return svgPathParser(elem.attrs.d.value).length;
    });

    return sum(counts);
  },

  overlappingPointCount(svg) {
    const counts = mapElements(svg, { type: 'path' }, (elem) => {
      const path = svgPathParser(elem.attrs.d.value);
      const coordinates = {};

      for (const command of path) {
        if (command.code === 'M' && !command.relative && !!command.x && !!command.y) {
          const key = `${command.x}, ${command.y}`;
          coordinates[key] = (!coordinates[key]) ? 1 : coordinates[key] + 1;
        }
      }

      return Object.keys(coordinates).reduce((memo, key) => {
        const localCount = coordinates[key];
        return memo + ((localCount > 1) ? localCount : 0);
      }, 0);
    });

    return sum(counts);
  },
};
