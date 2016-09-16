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

  function* lowPrecision(d) {
    const acceptable = 500 * 500;
    const viewboxArea = (d.viewboxSize) ? d.viewboxSize[0] * d.viewboxSize[1] : acceptable;

    if (viewboxArea < acceptable && d.decimalPrecision < 3) {
      yield {
        warning: {
          code: 'LOW_PRECISION',
          desc: 'This icon is small and the precision of the data points is also low. This results in poor vector quality.',
        },
      };
    }
  },
];

