/*!
 * marionette.compositelayout.js v0.1.0
 * Copyright 2015, Filippo Mangione (@PhilMangione)
 * marionette.compositelayout.js may be freely distributed under the MIT license.
 */

(function(root, factory) {
  'use strict';

  // AMD. Register as an anonymous module.
  // Wrap in function so we have access to root via `this`.
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'marionette', 'underscore', 'jquery'], function() {
      return factory.apply(root, arguments);
    });
  }

  // Node. Does not work with strict CommonJS, but only CommonJS-like
  // environments that support module.exports, like Node.
  else if (typeof exports === 'object') {
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var _ = require('underscore');

    module.exports = factory.call(root, Backbone, Marionette, _, $);
  }

  // Browser globals.
  else {
    factory.call(root, root.Backbone, root.Marionette, root._, root.$);
  }

}(typeof global === 'object' ? global : this, function (Backbone, Marionette, _, $) {
  'use strict';

  // CompositeLayout is a wrapper around a `Marionette.LayoutView`
  var CompositeLayout = Marionette.LayoutView.extend({

    // Setting up the inheritance chain which allows changes to
    // Marionette.LayoutView.prototype.constructor which allows overriding
    constructor: function(){
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    closeAllRegions: function() {
      _.each(_.uniq(_.pluck(this.components, 'region')), function (r) {
        r = this.regionManager.get(r);
        if(r && _.isFunction(r.close)) {
          r.close();
        }
      }, this);
    },

    createComponentInstance: function(config,name) {
      var options = {},
          instance;

      _.each(['view','region'], function (v) {
        if (!_.has(config, v)) {
          throw Error('Component [' + name + '] Missing required option: ' + v);
        }
      });

      options = _.isFunction(config.options) ? config.options.call(this) : config.options;

      if(!(config.view.prototype instanceof Backbone.View)) {
        throw new Error('Component [' + name + '] is not a View');
      }

      instance = new config.view(options);
      instance.componentConfig = config;

      _.each(config.events, function (e, k) {
        if (_.isFunction(this[e])) {
          instance.on(k, this[e], this);
        } else {
          throw new Error('[Missing event handler: ' + e + ' for Component [' + name + ']');
        }
      }, this);

      this._components[name] = instance;

      return instance;
    },

    appendComponentToRegion: function(c) {
      var config = c.componentConfig;
      var region = this.regionManager.get(config.region);

      if (!_.isFunction(region.isShown) || region.isShown.call(this, this)) {
        if (region) {
          region.show(c);
        } else {
          throw Error('Region [' + config.region + '] does not exist.');
        }
      }
    },

    renderComponents: function () {
      this.closeAllRegions();
      _.each(_.map(this.components, this.createComponentInstance, this), this.appendComponentToRegion, this);
    },

    initializeComponents: function () {
      this._components = this._components || {};
      this.renderComponents();
    }

  });

  // Expose through Backbone object.
  Marionette.CompositeLayout = CompositeLayout;

  return CompositeLayout;

}));