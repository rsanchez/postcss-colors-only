'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-colors-only', function (options) {
    var cssColorList = require('css-color-list');
    var hexRegex = require('hex-color-regex');
    var rgbaRegex = require('rgba-regex');
    var rgbRegex = require('rgb-regex');
    var hslaRegex = require('hsla-regex');
    var hslRegex = require('hsl-regex');
    var util = require('util');

    var greyRegex =
    '^(' +
    '#([a-fA-F0-9]{1,2})\\2\\2' + '|' +
    '(dim|dark|light)?gr[ae]y' + '|' +
    'rgb\\((\\d+),\\s*\\4,\\s*\\4\\)' + '|' +
    'rgba\\((\\d+),\\s*\\5,\\s*\\5,\\s*\\d*(?:\\.\\d+)?\\)' + '|' +
    'hsl\\(\\s*0\\s*,\\s*0(\\.[0]+)?%\\s*,\\s*\\d*(?:\\.\\d+)?%\\)' + '|' +
    'hsla\\(0,\\s*0(\\.[0]+)?%,\\s*\\d*(?:\\.\\d+)?%,\\s*\\d*(?:\\.\\d+)?\\)' +
    ')$';

    var blackOrWhiteRegex =
    '^(' +
    '#([fF]{3}([fF]{3})?|000|000000)' + '|' +
    'black' + '|' +
    'white' + '|' +
    'rgb\\((0|255),\\s*\\4,\\s*\\4\\)' + '|' +
    'rgba\\((0|255),\\s*\\5,\\s*\\5,\\s*\\d*(?:\\.\\d+)?\\)' + '|' +
    'hsl\\(\\s*0\\s*,\\s*0(\\.[0]+)?%\\s*,\\s*(0|100)(\\.[0]+)?%\\)' + '|' +
    'hsla\\(0,\\s*0(\\.[0]+)?%,\\s*(0|100)(\\.[0]+)?%,\\s*\\d*(?:\\.\\d+)?\\)' +
    ')$';

    options = util._extend({
        withoutGrey:       false,
        withoutMonochrome: false
    }, options);

    function doesPropertyAllowColor(property) {
        var properties = [
            'color',
            'background',
            'background-color',
            'background-image',
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-color',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',
            'outline',
            'outline-color',
            'text-shadow',
            'box-shadow'
        ];

        return properties.indexOf(property) > -1;
    }

    function transformProperty(declaration, colors) {
        var propertyTransformers = {
            background:      'background-color',
            border:          'border-color',
            'border-top':    'border-top-color',
            'border-right':  'border-right-color',
            'border-bottom': 'border-bottom-color',
            'border-left':   'border-left-color',
            outline:         'outline-color'
        };

        if (typeof propertyTransformers[declaration.prop] === 'undefined') {
            return;
        }

        if (colors.length === 1) {
            declaration.prop = propertyTransformers[declaration.prop];
            declaration.value = colors[0];
        }
    }

    function isColor(value) {
        var regex = new RegExp(
            '^(' +
            cssColorList().join('|') + '|' +
            rgbRegex().source + '|' +
            rgbaRegex().source + '|' +
            hslRegex().source + '|' +
            hslaRegex().source + '|' +
            hexRegex().source +
            ')$'
        );

        return regex.test(value);
    }

    function isColorBlackOrWhite(color) {
        return new RegExp(blackOrWhiteRegex).test(color);
    }

    function isColorGrey(color) {
        if (isColorBlackOrWhite(color)) {
            return false;
        }

        return new RegExp(greyRegex).test(color);
    }

    function isColorMonochrome(color) {
        return isColorBlackOrWhite(color) || isColorGrey(color);
    }

    function findColors(string) {
        var colors = [];
        var list = postcss.list.comma(string);
        var values = [];

        list.forEach(function (items) {
            postcss.list.space(items).forEach(function (item) {
                var regex = new RegExp(
                    '^' +
                    '(-webkit-|-moz-|-o-)?' +
                    '(repeating-)?' +
                    '(radial|linear)-gradient\\((.*?)\\)' +
                    '$'
                );

                var match = item.match(regex);

                if (match) {
                    values = values.concat(postcss.list.comma(match[4]));
                } else {
                    values.push(item);
                }
            });
        });

        values.forEach(function (value) {
            if (!isColor(value)) {
                return;
            }

            if (options.withoutMonochrome && isColorMonochrome(value)) {
                return;
            }

            if (options.withoutGrey && isColorGrey(value)) {
                return;
            }

            colors.push(value);
        });

        return colors;
    }

    function findColorsInDeclaration(declaration) {
        if (!doesPropertyAllowColor(declaration.prop)) {
            return [];
        }

        return findColors(declaration.value);
    }

    function processDeclaration(declaration) {
        var colors = findColorsInDeclaration(declaration);

        if (colors.length === 0) {
            declaration.remove();
        } else {
            transformProperty(declaration, colors);
        }
    }

    function processRule(rule) {
        rule.each(processDeclaration);

        if (rule.nodes.length === 0) {
            rule.remove();
        }
    }

    function processAtrule(atrule) {
        switch (atrule.name) {
            case 'media':
                atrule.each(processNode);

                if (atrule.nodes.length === 0) {
                    atrule.remove();
                }

                break;
            // @TODO deal with other types of atrules
            default:
                atrule.remove();
                break;
        }
    }

    function processNode(node) {
        switch (node.type) {
            case 'atrule':
                processAtrule(node);
                break;
            case 'rule':
                processRule(node);
                break;
            default:
                node.remove();
                break;
        }
    }

    return function (css) {
        css.each(processNode);
    };
});
