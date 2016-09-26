import fs from 'fs';
import cli from 'cli';
import parser from './parser';
import ui from './ui';

cli.parse({
  file: ['f', 'SVG to process', 'file'],
  json: ['j', 'Output in JSON format'],
});

export default function run() {
  cli.main(function (args, options) {
    const { file, json } = options;

    if (!file) {
      this.fatal('Could not find the SVG file. Make sure you are using -f FILE.');
    }

    fs.readFile(file, 'utf8', (err, data) => {
      if (err !== null) {
        this.fatal(err);
      }

      parser(data)
        .then((output) => {
          return (json) ? ui.json(output) : ui.humans(output);
        });
    });
  });
}
