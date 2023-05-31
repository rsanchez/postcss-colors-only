'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-colors-only', function(options) {
  const extractor = require('css-color-extractor');

  function transformProperty(decl, colors) {
    const propertyTransformers = {
      background: 'background-color',
      border: 'border-color',
      'border-top': 'border-top-color',
      'border-right': 'border-right-color',
      'border-bottom': 'border-bottom-color',
      'border-left': 'border-left-color',
      outline: 'outline-color',
    };

    if (typeof propertyTransformers[decl.prop] === 'undefined') {
      return;
    }

    if (colors.length === 1) {
      decl.prop = propertyTransformers[decl.prop];
      decl.value = colors[0];
    }
  }

  function removeColors(decl, colors) {
    const blacklist = [
      'gradient',
      'text-shadow',
    ];

    if (blacklist.some(function(blacklistItem) {
      return ['value', 'prop'].some(function(key) {
        return decl[key].indexOf(blacklistItem) !== -1;
      });
    })) {
      return;
    }

    if (colors.length) {
      decl.value = colors.reduce(function(value, color) {
        return value.replace(color, '');
      }, decl.value).trim();
    }

    if (decl.value.length === 0) {
      decl.remove();
    }
  }

  function processDeclWithColorKeeping(decl) {
    const colors = extractor.fromDecl(decl, options);

    if (colors.length === 0) {
      decl.remove();
    } else {
      transformProperty(decl, colors);
    }
  }

  function processDeclWithColorRemoving(decl) {
    const colors = extractor.fromDecl(decl, options);

    if (colors.length !== 0) {
      removeColors(decl, colors);
    } else {
      transformProperty(decl, colors);
    }
  }

  const processDecl = options.inverse
    ? processDeclWithColorRemoving
    : processDeclWithColorKeeping;

  function processRule(rule) {
    rule.each(processDecl);

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

  return function(css) {
    css.each(processNode);
  };
});
