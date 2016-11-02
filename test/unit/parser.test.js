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
        expect(output).to.be.redStoplight();
        expect(output).to.error('PARSE_FAILED');
        done();
      });
  });

  it('will optimize the file', function (done) {
    parser(fixture('valid.svg'))
      .then((output) => {
        expect(output).to.be.greenStoplight();
        expect(output.messages.errors.length).to.equal(0);
        expect(output.messages.warnings.length).to.equal(0);
        expect(output.optimized.length).to.be.above(0);
        done();
      });
  });

  it('will prevent an SVG that crashes FontForge (example 1)', function (done) {
    parser(fixture('dropforge-killer-1.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('SHAPE_STROKES');
        done();
      });
  });

  it('will prevent an SVG that crashes FontForge (example 2)', function (done) {
    parser(fixture('dropforge-killer-2.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('SHAPE_STROKES');
        done();
      });
  });

  it('will process CDATA with stroke from styles', function (done) {
    parser(fixture('has-cdata.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('SHAPE_STROKES');
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

  it('will detect inkscape attributes', function (done) {
    parser(fixture('inkscape-attributes.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('INKSCAPE_FORMAT');
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

  it('will detect a path that has no fill', function (done) {
    parser(fixture('paths-with-no-fill.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('INVISIBLE_OBJECTS');
        done();
      });
  });

  it('will detect if the entire SVG is set to display: none', function (done) {
    parser(fixture('svg-display-none.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('EVERYTHING_HIDDEN');
        done();
      });
  });

  it('will detect images', function (done) {
    parser(fixture('with-image.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('CONTAINS_IMAGES');
        done();
      });
  });

  it('will require a viewbox', function (done) {
    parser(fixture('no-viewbox.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('MISSING_VIEWBOX');
        done();
      });
  });

  it('will detect SVG font files', function (done) {
    parser(fixture('svg-font.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('IS_SVG_FONT');
        done();
      });
  });

  it('will detect spleens off the viewport', function (done) {
    parser(fixture('points-out-of-viewport.svg'))
      .then((output) => {
        expect(output).to.be.yellowStoplight();
        expect(output).to.warn('EXCEEDS_VIEWBOX');
        done();
      });
  });

  it('will detect spleens inside the viewport with transforms', function (done) {
    parser(fixture('points-inside-of-viewport-with-transform.svg'))
      .then((output) => {
        expect(output).to.not.warn('EXCEEDS_VIEWBOX');
        done();
      });
  });

  it('will detect a reference to a system font', function (done) {
    parser(fixture('linked-font.svg'))
      .then((output) => {
        expect(output).to.be.redStoplight();
        expect(output).to.error('CONTAINS_TEXT');
        done();
      });
  });
});
