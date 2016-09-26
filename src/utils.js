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

  if (options.type === undefined || p.elem === options.type) {
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
  let value = {};
  const translateMatch = (transformValue || "").match(/translate\((\-?[0-9\.]+)\s?(\-?[0-9\.]+)\)/);

  if (translateMatch) {
    let [_, x, y] = translateMatch;

    value['translate'] = {x: parseInt(x, 10), y: parseInt(y, 10)};
  }

  return value;
}

export function pointExceedsViewbox(x, y, viewbox, options) {
  let optionsWithDefaults = Object.assign({}, {
    padding: 0,
  }, options);

  const {padding} = optionsWithDefaults;

  let [minX, minY, width, height] = viewbox;

  minX   -= padding;
  minY   -= padding;
  width  += padding * 2;
  height += padding * 2;

  const maxX = minX + width;
  const maxY = minY + height;

  return (x < minX || x > maxX || y < minY || y > maxY);
}
