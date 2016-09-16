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
];

