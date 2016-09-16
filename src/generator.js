export default function* generator(determinations) {
  for (const message of MESSAGES) {
    yield* message(determinations);
  }
}

const MESSAGES = [
  function* strokes(determinations) {
    if (determinations.strokedPaths) {
      yield {
        error: {
          code: 'PATH_STROKES',
          desc: 'Contains strokes on paths which will not convert',
        },
      };
    }
  },
];

