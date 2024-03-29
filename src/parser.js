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

function inspect(rawSvg, parsedSvg) {
  return new Promise((resolve, reject) => {
    const determinations = {};

    try {
      for (const key of Object.keys(inspectors)) {
        determinations[key] = inspectors[key](rawSvg, parsedSvg);
      }

      resolve(determinations);
    } catch (e) {
      reject(e);
    }
  });
}

function generateMessages(determinations) {
  return new Promise((resolve, reject) => {
    let errors = [];
    let warnings = [];

    try {
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
    } catch (e) {
      reject(e);
    }
  });
}

function mergeMessages(output, generated) {
  const nextOutput = Object.assign({}, output);

  nextOutput.messages.errors = Array.concat(
    output.messages.errors,
    generated.messages.errors
  );
  nextOutput.messages.warnings = Array.concat(
    output.messages.warnings,
    generated.messages.warnings
  );

  if (output.stoplight !== STOPLIGHT_RED) {
    nextOutput.stoplight = (output.stoplight) ?
      output.stoplight :
      generated.stoplight;
  }

  return nextOutput;
}

export default function (svgDataBuffer) {
  let output = {
    stoplight: null,
    messages: {
      errors: [],
      warnings: [],
    },
    optimized: null,
  };

  return new Promise((resolve, reject) => {
    svg2js(svgDataBuffer, (parsedSvg) => {
      const { error } = parsedSvg;

      if (error) {
        output.messages.errors.push({ code: 'PARSE_FAILED', desc: error });
        output.stoplight = STOPLIGHT_RED;
      }

      const svgData = svgDataBuffer.toString();

      inspect(svgData, (error) ? null : parsedSvg)
        .then(determinations => generateMessages(determinations))
        .then((generated) => {
          output = mergeMessages(output, generated);

          if (output.stoplight === STOPLIGHT_GREEN) {
            optimize(svgDataBuffer)
              .then((optimizedData) => {
                output.optimized = optimizedData.data;

                resolve(output);
              });
          } else {
            resolve(output);
          }
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    });
  });
}
