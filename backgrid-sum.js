(function (window) {
  var SummedRow = window.Backgrid.SummedRow = window.Backgrid.Row.extend({
    render: function () {
      console.log('render');
      this.$el.empty();

      var fragment = document.createDocumentFragment();
      for (var i = 0; i < this.cells.length; i++) {
        fragment.appendChild(this.cells[i].render().el);
      }
      fragment.appendChild(this.getSumCell().render().el);

      this.el.appendChild(fragment);

      this.delegateEvents();

      return this;
    },

    getSum: function () {
      var _this = this;
      return this.columns.reduce(function (memo, column) {
        var value = _this.model.get(column.get('name'));
        return memo + parseFloat(value);
      }, 0);
    },

    getSumCell: function () {
      var _this = this;
      return new (
        Backgrid.Cell.extend({
          initialize: function () { },
          render: function () {
            this.$el.html(_this.getSum());
            return this;
          }
        })
      );
    }
  });

  window.Backgrid.SummedColumnBody = window.Backgrid.Body.extend({
    render: function () {
      window.Backgrid.Body.prototype.render.apply(this, arguments); 

      this.el.appendChild(this.getSumRow().render().el);

      return this;
    },

    getSumRow: function () {
      var _this = this;
      return new (
        Backbone.View.extend({
          tagName: 'tr',
          render: function () {
            _this.columns.each(function (column) {
              var values = _this.collection.pluck(column.get('name'));
              var sum = _.reduce(values, function (memo, num) {
                return memo + parseFloat(num);
              }, 0);
              _this.$el.append('<td>' + sum + '</td>');
            });

            return this;
          }
        })
      );
    }
  });
})(window);
