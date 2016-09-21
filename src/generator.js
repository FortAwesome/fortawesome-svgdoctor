export default function* generator(determinations) {
  for (const message of MESSAGES) {
    yield* message(determinations);
  }
}

const MESSAGES = [
  function* strokes(d) {
    if (d.strokedPaths) {
      yield {
        error: {
          code: 'PATH_STROKES',
          desc: 'Paths exist that have some kind of stroke.',
        },
      };
    }
  },

  function* tooManyPoints(d) {
    if (d.pointCount > 1000) {
      yield {
        warning: {
          code: 'LOTS_OF_POINTS',
          desc: `Contains at least ${d.pointCount} points.`,
        },
      };
    }
  },

  function* overlappingPoints(d) {
    if (d.overlappingPointCount > 0) {
      yield {
        warning: {
          code: 'OVERLAPPING_POINTS',
          desc: `There are ${d.overlappingPointCount} points that overlap. You may have duplicated objects.`,
        },
      };
    }
  },

  function* sketchFormat(d) {
    if (d.sketchFormat) {
      yield {
        error: {
          code: 'SKETCH_FORMAT',
          desc: 'This file is formatted for the Sketch app. It is not a valid SVG document.',
        },
      };
    }
  },

  function* inkscapeFormat(d) {
    if (d.inkscapeFormat) {
      yield {
        error: {
          code: 'INKSCAPE_FORMAT',
          desc: 'This file is formatted for the Inkscape app. It is not a valid SVG document.',
        },
      };
    }
  },

  function* lowPrecision(d) {
    const acceptable = 500 * 500;
    const viewboxArea = (d.viewbox[2] !== null && d.viewbox[3] !== null) ? d.viewbox[2] * d.viewbox[3] : acceptable;

    if (viewboxArea < acceptable && d.decimalPrecision < 3) {
      yield {
        warning: {
          code: 'LOW_PRECISION',
          desc: 'This icon is small and the precision of the data points is also low. This results in poor vector quality.',
        },
      };
    }
  },

  function* invisibleObjects(d) {
    if (~d.fillsUsed.indexOf('none')) {
      yield {
        warning: {
          code: 'INVISIBLE_OBJECTS',
          desc: 'There are objects that have a fill of "none". These will become visible objects once converted.',
        },
      };
    }
  },

  function* everythingIsHidden(d) {
    if (d.everythingIsHidden) {
      yield {
        error: {
          code: 'EVERYTHING_HIDDEN',
          desc: 'The <svg> element is set to "display: none" which will result in everything being hidden.',
        },
      };
    }
  },

  function* containsAnImage(d) {
    if (d.containsAnImage) {
      yield {
        warning: {
          code: 'CONTAINS_IMAGES',
          desc: 'Contains bitmap images that cannot be converted into icons.',
        },
      };
    }
  },

  function* missingViewbox(d) {
    if (d.viewbox[0] === null && d.viewbox[1] === null) {
      yield {
        error: {
          code: 'MISSING_VIEWBOX',
          desc: 'Contains bitmap images that cannot be converted into icons.',
        },
      };
    }
  },

  function* isSvgFont(d) {
    if (d.isSvgFont) {
      yield {
        error: {
          code: 'IS_SVG_FONT',
          desc: 'This is an SVG font which cannot be directly converted into a single icon.',
        },
      };
    }
  },

  function* pointsOffViewbox(d) {
    if (d.viewbox[0] !== null && d.viewbox[1] !== null) {
      let isOffViewbox = false;
      const [minX, minY, width, height] = d.viewbox;
      const maxX = minX + width;
      const maxY = minY + height;

      for (const point of d.points) {
        if (point[0] < minX || point[0] > maxX || point[1] < minY || point[1] > maxY) {
          isOffViewbox = true;
        }
      }

      if (isOffViewbox) {
        yield {
          warning: {
            code: 'EXCEEDS_VIEWBOX',
            desc: 'This is an SVG font which cannot be directly converted into a single icon.',
          },
        };
      }
    }
  },
];
