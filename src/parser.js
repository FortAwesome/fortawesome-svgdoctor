import Svgo from 'svgo';
import svg2js from 'svgo/lib/svgo/svg2js';

function optimize(svgData) {
  return new Promise((resolve) => {
    new Svgo().optimize(svgData, (result) => {
      resolve(result);
    });
  })
}

export default function (svgData) {
  const output = {
    stoplight: "green",
    messages: {
      errors: [],
      warning: [],
    },
    optimized: null,
  };

  return new Promise((resolve, reject) => {
    svg2js(svgData, (results) => {
      const {error} = results;

      if (error) {
        output.messages.errors.push({code: "PARSE_FAILED", desc: error});
        output.stoplight = "red";
      }

      optimize(svgData)
        .then((optimizedData) => {
          output.optimized = optimizedData.data;

          resolve(output);
        });
    });
  })
}
