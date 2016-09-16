import { expect } from 'chai';
import fs from 'fs';

import '../helpers/matchers';

import parser from '../../src/parser';

describe('Parser', function () {
  const fixture = (name) => {
    return fs.readFileSync(`./test/fixtures/${name}`);
  };

  it('will handle bad file type', function (done) {
    parser(fixture('bad-file-type.jpg'))
      .then((output) => {
        expect(output.messages.errors.length).to.equal(1);
        expect(output.stoplight).to.equal('red');

        done();
      });
  });

  it('will optimize the file', function (done) {
    parser(fixture('valid.svg'))
      .then((output) => {
        expect(output.stoplight).to.equal('green');
        expect(output.messages.errors.length).to.equal(0);
        expect(output.optimized.length).to.be.above(0);

        done();
      });
  });

  it('will prevent an SVG that crashes FontForge', function (done) {
    parser(fixture('dropforge-killer.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('PATH_STROKES');
        done();
      });
  });

  it('will detect a lot of points', function (done) {
    parser(fixture('lots-of-points.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('LOTS_OF_POINTS');
        done();
      });
  });

  it('will detect overlapping points (example 1)', function (done) {
    parser(fixture('tons-of-overlapping-points-1.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('OVERLAPPING_POINTS');
        done();
      });
  });

  it('will detect overlapping points (example 2)', function (done) {
    parser(fixture('tons-of-overlapping-points-2.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('OVERLAPPING_POINTS');
        done();
      });
  });

  it('will detect a Sketch formatted file', function (done) {
    parser(fixture('sketch-formatted.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('SKETCH_FORMAT');
        done();
      });
  });

  it('will detect a small viewbox with low precision', function (done) {
    parser(fixture('small-and-low-precision.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('LOW_PRECISION');
        done();
      });
  });

  xit('will detect a path that has no fill', function (done) {
  });
});
