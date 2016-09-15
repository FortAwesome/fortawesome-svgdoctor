import { expect } from 'chai';
import fs from 'fs';

import parser from '../../src/parser';

describe('Parser', function () {
  const fixture = (name) => {
    return fs.readFileSync(`./test/fixtures/${name}`);
  };

  it('will handle bad file type', function (done) {
    parser(fixture('bad-file-type.jpg'))
      .then((output) => {
        expect(output.messages.errors.length).to.equal(1);
        expect(output.stoplight).to.equal("red");

        done();
      })
  });

  it('will optimize the file', function (done) {
    parser(fixture('valid.svg'))
      .then((output) => {
        expect(output.messages.errors.length).to.equal(0);
        expect(output.stoplight).to.equal("green");
        expect(output.optimized.length).to.be.above(0);

        done();
      })
  });
});
