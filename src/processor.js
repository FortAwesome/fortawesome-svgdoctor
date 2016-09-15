import fs from 'fs';
import cli from 'cli';
import parser from './parser';

const options = cli.parse({
  file: ['f', 'SVG to process', 'file'],
})

export default function run() {
  cli.main(function (args, options) {
    const {file} = options;

    if (!file) {
      this.fatal("Could not find the SVG file. Make sure you are using -f FILE.");
    }

    fs.readFile(file, 'utf8', (err, data) => {
      if (err !== null) {
        this.fatal(err);
      }

      parser(data)
        .then((output) => {
          console.log(JSON.stringify(output, null, 2));
        })
    });
  });
}
