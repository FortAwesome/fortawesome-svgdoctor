# fortawesome-svgdoctor

Sticks a gloved hand up your SVG and let's you know what's wrong with it

## Getting Started

Install dependencies:

    npm install

Build the distribution:

    npm run compile

Link to this package so you can run the CLI:

    npm link .

Run the good doctor

    fortawesome-svgdoctor -f test/fixtures/dropforge-killer-1.svg

## Test fixtures

The files in `test/fixtures` are SVG files that have various problems with them. These are used in the
unit tests to make sure the Doc is catching the issues and reporting on them.

## Running the tests

    npm run test

## License

Private use only
