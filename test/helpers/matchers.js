import chai from 'chai';

chai.Assertion.addMethod('yellowStoplight', function () {
  this.assert(
    (this._obj.stoplight === 'yellow'),
    'expected stoplight to be yellow',
    'expected stoplight not to be yellow'
  );
});

chai.Assertion.addMethod('redStoplight', function () {
  this.assert(
    (this._obj.stoplight === 'red'),
    'expected stoplight to be red',
    'expected stoplight not to be red'
  );
});

chai.Assertion.addMethod('warn', function (expected) {
  const codes = this._obj.messages.warnings.map(i => i.code);

  this.assert(
    (~codes.indexOf(expected)),
    `expected ${expected} code to be in the warnings`,
    `expected ${expected} code not to be in the warnings`
  );
});

chai.Assertion.addMethod('error', function (expected) {
  const codes = this._obj.messages.errors.map(i => i.code);

  this.assert(
    (~codes.indexOf(expected)),
    `expected ${expected} code to be in the errors`,
    `expected ${expected} code not to be in the errors`
  );
});
