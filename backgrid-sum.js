(function (window) {
  var SummationUtility = {
    columnsToSum: [],
    multiplier: null,

    getColumnsToSum: function () {
      var columns = this.columns.without(this.columns.findWhere({ name: this.multiplier }));
      if (_(this.columnsToSum).isEmpty() === false) {
        columns = columns.filter(function (column) {
          return this.columnsToSum.indexOf(column.get('name')) !== -1;
        }, this);
      }
      return columns;
    },

    getSum: function () {
      return _(this.getColumnsToSum()).reduce(this.addColumnValue, 0, this);
    },

    addColumnValue: function (memo, column) {
      var value = this.model.get(column.get('name'));
      var multiplier = 1;

      if (this.multiplier) {
        if (isNaN(parseFloat(this.multiplier))) {
          multiplier = this.model.get(this.getColumnByName(this.multiplier).get('name'));
        } else {
          multiplier = parseFloat(this.multiplier);
        }
      }

      return memo + (parseFloat(value) * multiplier);
    }
  };

  var SummedRow = window.Backgrid.SummedRow = window.Backgrid.Row.extend({
    formatter: Backgrid.StringFormatter,

    render: function () {
      this.$el.empty();

      var fragment = document.createDocumentFragment();
      _(this.cells).each(function (cell) {
        fragment.appendChild(cell.render().el);
      });
      fragment.appendChild(this.getSumCell().render().el);

      this.el.appendChild(fragment);
      this.delegateEvents();
      return this;
    },

    getColumnByName: function (name) {
      return this.columns.findWhere({ name: name });
    },

    getSumCell: function () {
      var _this = this;
      return new (
        Backgrid.Cell.extend({
          className: _this.className || '',
          initialize: function () { },
          render: function () {
            this.$el.html(new _this.formatter().fromRaw(_this.getSum(), _this.model));
            return this;
          }
        })
      )();
    }
  });

  var SummedColumnBody = window.Backgrid.SummedColumnBody = window.Backgrid.Body.extend({
    formatter: Backgrid.StringFormatter,
    template: _.template('<td class="<%= className %>"><%= sum %></td>'),
	prepend: false,

    initialize: function () {
      Backgrid.Body.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'change add remove reset', this.render);
      this.listenTo(this.columns, 'change add remove reset', this.render);
    },

    render: function () {
      window.Backgrid.Body.prototype.render.apply(this, arguments);
	  if (this.prepend) {
		  this.$el.prepend(this.getSumRow().render().el);
	  } else {
		  this.el.appendChild(this.getSumRow().render().el);
	  }
      return this;
    },

    getFormatterForColumn: function (column) {
      if (this.formatters && this.formatters[column.get('name')]) {
        return new this.formatters[column.get('name')]();
      } else {
        return new window.Backgrid.StringFormatter();
      }
    },

    getSumRow: function () {
      var _this = this;
      return new (
        Backbone.View.extend({
          className: _this.className || '',
          tagName: 'tr',
          render: function () {
            _this.columns.forEach(_.bind(function (column) {
              var sum = '';
              if (_this.columnsToSum.indexOf(column.get('name')) !== -1) {
                var values = _this.collection.pluck(column.get('name'));
                sum = _.reduce(values, function (memo, num) {
                  return memo + parseFloat(num);
                }, 0);
                sum = _this.getFormatterForColumn(column).fromRaw(sum, _this.model);
              }
              this.$el.append(_this.template({ className: _this.className, sum: sum }));
            }, this));

            return this;
          }
        })
      )();
    }
  });

  _(SummedRow.prototype).extend(SummationUtility);
  _(SummedColumnBody.prototype).extend(SummationUtility);
})(window);
