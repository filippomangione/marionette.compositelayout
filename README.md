# marionette.compositelayout

[Marionette](http://marionettejs.com) layout that allows to define subviews inside regions in a declarative manner.

## Basic Use

It extends from `Marionette.LayoutView` to provide a simple way to attach subviews to a layout's regions. Each subview is instanciated and rendered by calling `initializeComponents` method. Options and events can be passed to each component.

```js
var DashboardLayout = Marionette.CompositeLayout.extend({
  template: dashboardTpl,
  
  regions: {
    chart: '[data-chart]'
  },
  
  onCustomEvent: function() {
    /* ... */
  },
  
  components: {
    chart: {
      view: ChartView,
      region: 'chart',
      events: {
        'custom.event': 'onCustomEvent'
      },
      options: function () {
        return {
          foo: 'bar'
        };
      }
    }
  },
    
  onRender: function() {
   this.initializeComponents();
  }
  
});

var dashboard = new DashboardLayout();
```

## License
Copyright 2015, Filippo Mangione (@PhilMangione).  
marionette.compositelayout.js may be freely distributed under the MIT license.
