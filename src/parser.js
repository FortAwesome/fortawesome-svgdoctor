import Svgo from 'svgo';
import svg2js from 'svgo/lib/svgo/svg2js';
import inspectors from './inspectors';
import generator from './generator';

const STOPLIGHT_GREEN = 'green';
const STOPLIGHT_YELLOW = 'yellow';
const STOPLIGHT_RED = 'red';

function optimize(svgData) {
  return new Promise((resolve) => {
    new Svgo().optimize(svgData, (result) => {
      resolve(result);
    });
  });
}

function inspect(parsedSvg) {
  return new Promise((resolve) => {
    const determinations = {};

    for (const key of Object.keys(inspectors)) {
      determinations[key] = inspectors[key](parsedSvg);
    }

    resolve(determinations);
  });
}

function generateMessages(determinations) {
  return new Promise((resolve) => {
    let errors = [];
    let warnings = [];

    for (const message of generator(determinations)) {
      if (message.error) {
        errors = Array.concat(errors, message.error);
      }

      if (message.warning) {
        warnings = Array.concat(warnings, message.warning);
      }
    }

    let stoplight = STOPLIGHT_GREEN;

    if (warnings.length > 0) {
      stoplight = STOPLIGHT_YELLOW;
    }

    if (errors.length > 0) {
      stoplight = STOPLIGHT_RED;
    }

    resolve({
      messages: {
        errors,
        warnings,
      },
      stoplight,
    });
  });
}

export default function (svgData) {
  const output = {
    stoplight: null,
    messages: {
      errors: [],
      warnings: [],
    },
    optimized: null,
  };

  return new Promise((resolve) => {
    svg2js(svgData, (parsedSvg) => {
      const { error } = parsedSvg;

      if (error) {
        output.messages.errors.push({ code: 'PARSE_FAILED', desc: error });
        output.stoplight = STOPLIGHT_RED;
      }

      optimize(svgData)
        .then((optimizedData) => {
          output.optimized = optimizedData.data;

          return inspect(parsedSvg);
        })
        .then(determinations => generateMessages(determinations))
        .then((generated) => {
          output.messages.errors = Array.concat(
            output.messages.errors,
            generated.messages.errors
          );
          output.messages.warnings = Array.concat(
            output.messages.warnings,
            generated.messages.warnings
          );
          output.stoplight = (output.stoplight) ?
            output.stoplight :
            generated.stoplight;

          resolve(output);
        });
    });
  });
}
