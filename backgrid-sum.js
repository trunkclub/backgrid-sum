(function (window) {

	var SummedColumnBody = window.Backgrid.SummedColumnBody = window.Backgrid.Body.extend({
		formatter: Backgrid.StringFormatter,
		template: _.template('<td class="<%= className %>"><div class="summary"><%= sum %></div><div class="summary-label"><%= label %></div></td>'),

		prepend: false,
		columnNames: [],

		initialize: function () {
			Backgrid.Body.prototype.initialize.apply(this, arguments);

			this.columnNames = _.keys(this.columnOptions);
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

		getColumnsToSum: function () {
			var columns = this.columns.without(this.columns.findWhere({ name: this.multiplier }));
			if (_(this.columnNames).isEmpty() === false) {
				columns = columns.filter(function (column) {
					return this.columnNames.indexOf(column.get('name')) !== -1;
				}, this);
			}
			return columns;
		},

		getSumRow: function () {
			var self = this;
			return new (
				Backbone.View.extend({
					className: self.className || '',
					tagName: 'tr',
					render: function () {
						self.columns.forEach(_.bind(function (column) {
							var columnName = column.get('name');
							var sum = '';
							if (self.columnNames.indexOf(columnName) !== -1) {
								sum = self.aggregate(columnName);
								sum = self.getFormatterForColumn(column).fromRaw(sum, self.model);
							}
							var label = self.columnOptions[columnName] ? 
								self.columnOptions[columnName].label : '';
							this.$el.append(self.template({
								className: this.className, 
								sum: sum,
								label: label
							}));
						}, this));

						return this;
					}
				})
			)();
		},

		aggregate: function (columnName) {
			var aggr = "";
			var options = this.columnOptions[columnName];
			var columnValues = this.collection.pluck(columnName);
			switch (options.method) {
			case 'sum':
				aggr = _.reduce(columnValues, function (memo, num) {
					return memo + parseFloat(num);
				}, 0);
				break;
			case 'mean':
			case 'avg':
				aggr = _.reduce(columnValues, function (memo, num) {
					return memo + parseFloat(num);
				}, 0);
				aggr /= columnValues.length;
				break;
			default:
				if (_.isFunction(options.method)) {
					aggr = options.method(this.collection);
				}
				break;
			}
			if (_.isNumber(aggr)) {
				aggr = Math.round(aggr * 100) / 100;
			}
			return aggr;
		}
	});

})(window);
