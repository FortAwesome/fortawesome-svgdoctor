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
