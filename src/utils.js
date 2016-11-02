import Big from 'big.js';

const shapeElements = [
  'circle',
  'ellipse',
  'line',
  'mesh',
  'path',
  'polygon',
  'polyline',
  'rect',
];

export function elementMatches(element, options) {
  const optionsEmpty = Object.keys(options).length === 0;
  let value = false;

  if (!optionsEmpty) {
    if (options.anyShape && ~shapeElements.indexOf(element)) {
      value = true;
    }

    if (options.type !== undefined && element === options.type) {
      value = true;
    }
  } else {
    value = true;
  }

  return value;
}

export function mapElements(p, options, callback) {
  let value = [];

  if (p.elem === '#document') {
    return mapElements(p.content, options, callback);
  }

  if (Array.isArray(p)) {
    for (const element of p) {
      value = Array.concat(value, mapElements(element, options, callback));
    }
  }

  if (elementMatches(p.elem, options)) {
    value.push(callback(p));
  }

  if (p.content) {
    value = Array.concat(value, mapElements(p.content, options, callback));
  }

  return value;
}

export function hasElementType(p, options) {
  let value = false;

  if (p) {
    value = mapElements(p, options, elem => elem).length > 0;
  }

  return value;
}

export function svgTransformParser(transformValue) {
  const value = {};
  const translateMatch = (transformValue || '').match(/translate\((\-?[0-9\.]+)\s?(\-?[0-9\.]+)\)/);

  if (translateMatch) {
    const [_, x, y] = translateMatch;  // eslint-disable-line no-unused-vars

    value.translate = { x: new Big(x), y: new Big(y) };
  }

  return value;
}

export function pointExceedsViewbox(x, y, viewbox) {
  const [minX, minY, width, height] = viewbox;

  const maxX = minX + width;
  const maxY = minY + height;

  return (x < minX || x > maxX || y < minY || y > maxY);
}
