import cli from 'cli-color';

const MAP_STOPLIGHT_TO_COLOR = {
  'red': cli.bgRed,
  'yellow': cli.bgYellow,
  'green': cli.bgGreen,
};

export default {
  json(output) {
    console.log(JSON.stringify(output, null, 2));
  },

  humans(output) {
    if (output.stoplight === 'green') {
      console.log(cli.bold.underline('Optimized SVG:'));
      console.log('');
      console.log(output.optimized);
      console.log('');
    }

    console.log(MAP_STOPLIGHT_TO_COLOR[output.stoplight](` SVG Doctor results: ${output.stoplight} `));
    console.log('');

    for (const message of output.messages.errors) {
      console.log(cli.bold.red(message.code));
      console.log(`  ${message.desc}`);
      console.log('');
    }

    for (const message of output.messages.warnings) {
      console.log(cli.bold.yellow(message.code));
      console.log(`  ${message.desc}`);
      console.log('');
    }
  },
}
