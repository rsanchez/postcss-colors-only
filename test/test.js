var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
    postcss([ plugin(opts) ]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-colors-only', function () {

    it('should keep named color.', function (done) {
        test(
            'a { color: red; } p { display: block; }',
            'a { color: red; }',
            {},
            done
        );
    });

    it('should keep three-letter hex color.', function (done) {
        test(
            'a { color: #123; } p { display: block; }',
            'a { color: #123; }',
            {},
            done
        );
    });

    it('should keep six-letter hex color.', function (done) {
        test(
            'a { color: #123123; } p { display: block; }',
            'a { color: #123123; }',
            {},
            done
        );
    });

    it('should keep rgb color.', function (done) {
        test(
            'a { color: rgb(1, 2, 3); } p { display: block; }',
            'a { color: rgb(1, 2, 3); }',
            {},
            done
        );
    });

    it('should keep rgba color.', function (done) {
        test(
            'a { color: rgba(1, 2, 3, 0.5); } p { display: block; }',
            'a { color: rgba(1, 2, 3, 0.5); }',
            {},
            done
        );
    });

    it('should keep hsl color.', function (done) {
        test(
            'a { color: hsl(1, 2%, 3%); } p { display: block; }',
            'a { color: hsl(1, 2%, 3%); }',
            {},
            done
        );
    });

    it('should keep hsla color.', function (done) {
        test(
            'a { color: hsla(1, 2%, 3%, 0.5); } p { display: block; }',
            'a { color: hsla(1, 2%, 3%, 0.5); }',
            {},
            done
        );
    });

    it('should keep background-color.', function (done) {
        test(
            'a { background-color: red; } p { display: block; }',
            'a { background-color: red; }',
            {},
            done
        );
    });

    it('should keep border-color.', function (done) {
        test(
            'a { border-color: red; } p { display: block; }',
            'a { border-color: red; }',
            {},
            done
        );
    });

    it('should keep border-top-color.', function (done) {
        test(
            'a { border-top-color: red; } p { display: block; }',
            'a { border-top-color: red; }',
            {},
            done
        );
    });

    it('should keep border-right-color.', function (done) {
        test(
            'a { border-right-color: red; } p { display: block; }',
            'a { border-right-color: red; }',
            {},
            done
        );
    });

    it('should keep border-bottom-color.', function (done) {
        test(
            'a { border-bottom-color: red; } p { display: block; }',
            'a { border-bottom-color: red; }',
            {},
            done
        );
    });

    it('should keep border-left-color.', function (done) {
        test(
            'a { border-left-color: red; } p { display: block; }',
            'a { border-left-color: red; }',
            {},
            done
        );
    });

    it('should keep background-image.', function (done) {
        test(
            'a { background-image: linear-gradient(to bottom, red, blue); } ' +
                'p { display: block; }',
            'a { background-image: linear-gradient(to bottom, red, blue); }',
            {},
            done
        );
    });

    it('should keep outline-color.', function (done) {
        test(
            'a { outline-color: red; } p { display: block; }',
            'a { outline-color: red; }',
            {},
            done
        );
    });

    it('should keep text-shadow.', function (done) {
        test(
            'a { text-shadow: 1px 1px 2px black; } p { display: block; }',
            'a { text-shadow: 1px 1px 2px black; }',
            {},
            done
        );
    });

    it('should keep box-shadow.', function (done) {
        test(
            'a { box-shadow: 10px 5px 5px black; } p { display: block; }',
            'a { box-shadow: 10px 5px 5px black; }',
            {},
            done
        );
    });

    it('should change background to background-color.', function (done) {
        test(
            'a { background: red url(../foo.jpg) no-repeat center center; } ' +
                'p { display: block; }',
            'a { background-color: red; }',
            {},
            done
        );
    });

    it('should not change with multiple colors.', function (done) {
        test(
            'a { background: red url(../foo.jpg), blue url(../bar.jpg); } ' +
                'p { display: block; }',
            'a { background: red url(../foo.jpg), blue url(../bar.jpg); }',
            {},
            done
        );
    });

    it('should change outline to outline-color.', function (done) {
        test(
            'a { outline: 1px solid white; } p { display: block; }',
            'a { outline-color: white; }',
            {},
            done
        );
    });

    it('should change border to border-color.', function (done) {
        test(
            'a { border: 1px solid white; } p { display: block; }',
            'a { border-color: white; }',
            {},
            done
        );
    });

    it('should change border-top to border-top-color.', function (done) {
        test(
            'a { border-top: 1px solid white; } p { display: block; }',
            'a { border-top-color: white; }',
            {},
            done
        );
    });

    it('should change border-right to border-right-color.', function (done) {
        test(
            'a { border-right: 1px solid white; } p { display: block; }',
            'a { border-right-color: white; }',
            {},
            done
        );
    });

    it('should change border-bottom to border-bottom-color.', function (done) {
        test(
            'a { border-bottom: 1px solid white; } p { display: block; }',
            'a { border-bottom-color: white; }',
            {},
            done
        );
    });

    it('should change border-left to border-left-color.', function (done) {
        test(
            'a { border-left: 1px solid white; } p { display: block; }',
            'a { border-left-color: white; }',
            {},
            done
        );
    });

    it('should remove grey, but not black or white.', function (done) {
        test(
            'a { color: red; } p { color: grey; } h1 { color: black; }',
            'a { color: red; } h1 { color: black; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove grey', function (done) {
        test(
            'a { color: red; } p { color: grey; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove gray', function (done) {
        test(
            'a { color: red; } p { color: gray; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove lightgrey', function (done) {
        test(
            'a { color: red; } p { color: lightgrey; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove lightgray', function (done) {
        test(
            'a { color: red; } p { color: lightgray; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove dimgrey', function (done) {
        test(
            'a { color: red; } p { color: dimgrey; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove dimgray', function (done) {
        test(
            'a { color: red; } p { color: dimgray; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove darkgrey', function (done) {
        test(
            'a { color: red; } p { color: darkgrey; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove darkgray', function (done) {
        test(
            'a { color: red; } p { color: darkgray; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove three-letter hex grey', function (done) {
        test(
            'a { color: red; } p { color: #111; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove six-letter hex grey', function (done) {
        test(
            'a { color: red; } p { color: #121212; border-color: #111111; }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove rgb grey', function (done) {
        test(
            'a { color: red; } p { color: rgb(1, 1, 1); }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove rgba grey', function (done) {
        test(
            'a { color: red; } p { color: rgba(1, 1, 1, 0.5); }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove hsl grey', function (done) {
        test(
            'a { color: red; } p { color: hsl(0, 0, 1%); }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove hsla grey', function (done) {
        test(
            'a { color: red; } p { color: hsla(0, 0, 1%, 0.5); }',
            'a { color: red; }',
            { withoutGrey: true },
            done
        );
    });

    it('should remove grey', function (done) {
        test(
            'a { color: red; } p { color: grey; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove white', function (done) {
        test(
            'a { color: red; } p { color: white; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove three-letter hex white', function (done) {
        test(
            'a { color: red; } p { color: #fFf; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove six-letter hex white', function (done) {
        test(
            'a { color: red; } p { color: #fFfFfF; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove rgb white', function (done) {
        test(
            'a { color: red; } p { color: rgba(255, 255, 255); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove rgba white', function (done) {
        test(
            'a { color: red; } p { color: rgba(255, 255, 255, 0.5); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove hsl white', function (done) {
        test(
            'a { color: red; } p { color: hsl(0, 0, 100%); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove hsla white', function (done) {
        test(
            'a { color: red; } p { color: hsla(0, 0, 100%, 0.5); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove black', function (done) {
        test(
            'a { color: red; } p { color: black; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove three-letter hex black', function (done) {
        test(
            'a { color: red; } p { color: #000; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove six-letter hex black', function (done) {
        test(
            'a { color: red; } p { color: #000000; }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove rgb black', function (done) {
        test(
            'a { color: red; } p { color: rgba(0, 0, 0); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove rgba black', function (done) {
        test(
            'a { color: red; } p { color: rgba(0, 0, 0, 0.5); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove hsl black', function (done) {
        test(
            'a { color: red; } p { color: hsl(0, 0, 0%); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove hsla black', function (done) {
        test(
            'a { color: red; } p { color: hsla(0, 0, 0%, 0.5); }',
            'a { color: red; }',
            { withoutMonochrome: true },
            done
        );
    });

    it('should remove comment', function (done) {
        test(
            'a { color: red; } /* some comment */',
            'a { color: red; }',
            {},
            done
        );
    });

    it('should read nested @media rules', function (done) {
        test(
            'a { color: red; } @media (screen-only) { a { color: blue; } ' +
                'p { display: block; } }',
            'a { color: red; } @media (screen-only) { a { color: blue; } }',
            {},
            done
        );
    });

    it('should remove empty @media rule', function (done) {
        test(
            'a { color: red; } @media (screen-only) { p { display: block; } }',
            'a { color: red; }',
            {},
            done
        );
    });

    it('should remove non-media atrule', function (done) {
        test(
            'a { color: red; } @charset "UTF-8";',
            'a { color: red; }',
            {},
            done
        );
    });
});

describe('postcss-colors-only with inverse flag enabled', function () {

    var opts = { inverse: true };

    it('should remove named color.', function (done) {
        test(
            'a { color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove three-letter hex color.', function (done) {
        test(
            'a { color: #123; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove six-letter hex color.', function (done) {
        test(
            'a { color: #123123; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove rgb color.', function (done) {
        test(
            'a { color: rgb(1, 2, 3); } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove rgba color.', function (done) {
        test(
            'a { color: rgba(1, 2, 3, 0.5); } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove hsl color.', function (done) {
        test(
            'a { color: hsl(1, 2%, 3%); } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove hsla color.', function (done) {
        test(
            'a { color: hsla(1, 2%, 3%, 0.5); } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove background-color.', function (done) {
        test(
            'a { background-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove border-color.', function (done) {
        test(
            'a { border-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove border-top-color.', function (done) {
        test(
            'a { border-top-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove border-right-color.', function (done) {
        test(
            'a { border-right-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove border-bottom-color.', function (done) {
        test(
            'a { border-bottom-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove border-left-color.', function (done) {
        test(
            'a { border-left-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should keep background-image.', function (done) {
        test(
            'a { background-image: linear-gradient(to bottom, red, blue); } ' +
                'p { display: block; }',
            'a { background-image: linear-gradient(to bottom, red, blue); } ' +
                'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove outline-color.', function (done) {
        test(
            'a { outline-color: red; } p { display: block; }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should keep text-shadow.', function (done) {
        test(
            'a { text-shadow: 1px 1px 2px black; } p { display: block; }',
            'a { text-shadow: 1px 1px 2px black; } p { display: block; }',
            opts,
            done
        );
    });

    it('should remove comment', function (done) {
        test(
            'a { color: red; } p { display: block; } /* some comment */',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should read nested @media rules', function (done) {
        test(
            'a { color: red; } @media (screen-only) { a { color: blue; } ' +
                'p { display: block; } }',
            '@media (screen-only) { p { display: block; } }',
            opts,
            done
        );
    });

    it('should remove empty @media rule', function (done) {
        test(
            'p { display: block; } @media (screen-only) { a { color: blue; } }',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove non-media atrule', function (done) {
        test(
            'a { color: red; } p { display: block; } @charset "UTF-8";',
            'p { display: block; }',
            opts,
            done
        );
    });

    it('should remove colors from shorthand rules', function (done) {
        test(
            'p { border: 1px solid red; }',
            'p { border: 1px solid; }',
            opts,
            done
        );
    });

    it('should remove empty rules', function (done) {
        test(
            'p { border: 1px solid red; color: blue; }',
            'p { border: 1px solid; }',
            opts,
            done
        );
    });

});
