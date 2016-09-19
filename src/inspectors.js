import some from 'lodash-node/modern/collection/some';
import sum from 'lodash-node/modern/math/sum';
import flatten from 'lodash-node/modern/array/flatten';
import uniq from 'lodash-node/modern/array/uniq';
import filter from 'lodash-node/modern/collection/filter';
import css from 'css';
import svgPathParser from 'svg-path-parser';
import { mapElements } from './utils';

export default {
  strokedPaths(_raw, svg) {
    let value = 0;

    if (svg) {
      const strokesPresent = mapElements(svg, { type: 'path' }, (elem) => {
        return !!(elem.attrs.stroke && elem.attrs['stroke-width']);
      });

      value = some(strokesPresent);
    }

    return value;
  },

  pointCount(_raw, svg) {
    let value = 0;

    if (svg) {
      const counts = mapElements(svg, { type: 'path' }, (elem) => {
        return svgPathParser(elem.attrs.d.value).length;
      });

      value = sum(counts);
    }

    return value;
  },

  overlappingPointCount(_raw, svg) {
    let value = 0;

    if (svg) {
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

      value = sum(counts);
    }

    return value;
  },

  sketchFormat(raw) {
    return raw.includes('sketch:type');
  },

  decimalPrecision(_raw, svg) {
    let value = 0;

    if (svg) {
      const numbers = mapElements(svg, { type: 'path' }, (elem) => {
        const path = svgPathParser(elem.attrs.d.value);
        const data = [];
        const lookingFor = ['x', 'y'];

        for (const command of path) {
          lookingFor.forEach((key) => {
            if (command[key]) {
              data.push(command[key]);
            }
          });
        }

        return data;
      });

      value = flatten(numbers).reduce((memo, number) => {
        const numberString = number.toString();
        const precisionAfterDecimal = (~numberString.indexOf('.')) ? numberString.toString().split('.').slice(-1)[0].length : 0;

        return (memo < precisionAfterDecimal) ? precisionAfterDecimal : memo;
      }, 0);
    }

    return value;
  },

  viewboxSize(_raw, svg) {
    let value = 0;

    if (svg) {
      const viewboxes = mapElements(svg, { type: 'svg' }, (elem) => {
        const corners = elem.attrs.viewBox.value.split(' ').map(i => parseInt(i, 10));
        return [corners[2], corners[3]];
      });

      value = (viewboxes) ? viewboxes[0] : null;
    }

    return value;
  },

  fillsUsed(_raw, svg) {
    const declaredFills = {};
    let value = [];

    if (svg) {
      mapElements(svg, { type: 'style' }, (elem) => {
        const { stylesheet } = css.parse(elem.content[0].text);
        for (const rule of stylesheet.rules) {
          for (const declaration of rule.declarations) {
            if (declaration.property === 'fill') {
              declaredFills[rule.selectors[0]] = declaration.value;
            }
          }
        }
      });

      value = mapElements(svg, {}, (elem) => {
        const cssClass = (elem.attrs && elem.attrs.class) ? elem.attrs.class.value : '';

        return declaredFills[`.${cssClass}`];
      });
    }

    return filter(uniq(value));
  },

  everythingIsHidden(_raw, svg) {
    let value = false;

    if (svg) {
      mapElements(svg, { type: 'svg' }, (elem) => {
        if (elem.attrs && elem.attrs.display && elem.attrs.display.value === 'none') {
          value = true;
        }
      });
    }

    return value;
  },
};
