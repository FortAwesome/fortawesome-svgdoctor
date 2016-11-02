import { pointExceedsViewbox } from './utils';

export default function* generator(determinations) {
  for (const message of MESSAGES) {
    yield* message(determinations);
  }
}

const MESSAGES = [
  function* strokes(d) {
    if (d.strokedShapes) {
      yield {
        error: {
          code: 'SHAPE_STROKES',
          desc: 'Shapes exist that have some kind of stroke.',
        },
      };
    }
  },

  function* tooManyPoints(d) {
    if (d.points.length > 1000) {
      yield {
        warning: {
          code: 'LOTS_OF_POINTS',
          desc: `Contains at least ${d.points.length} points.`,
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
    const w = d.viewbox[2];
    const h = d.viewbox[3];
    const viewboxArea = (w !== null && h !== null) ? w * h : acceptable;

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
          desc: 'The <svg> element is missing the "viewBox" attribute which defines the visible area.',
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

      for (const point of d.points) {
        if (pointExceedsViewbox(point[0], point[1], d.viewbox)) {
          isOffViewbox = true;
        }
      }

      if (isOffViewbox) {
        yield {
          warning: {
            code: 'EXCEEDS_VIEWBOX',
            desc: 'Some parts of this SVG appear to be outside of the viewbox.',
          },
        };
      }
    }
  },

  function* containsText(d) {
    if (d.containsText) {
      yield {
        error: {
          code: 'CONTAINS_TEXT',
          desc: 'Contains text elements which should be converted to outlines.',
        },
      };
    }
  },
];
