backgrid-sum
============

#### Step 1)
```javascript
var col = new Backbone.Collection(
  [
    { name: '10.95', value: '15.50' },
    { name: '15.50', value: '20.75' }
  ]
);

var grid = new Backgrid.Grid({
  columns: [
    { name: 'name', label: 'Name', editable: false, cell: 'string' },
    { name: 'value', label: 'Value', editable: false, cell: 'string' }
  ],
  collection: col,
  row: window.Backgrid.SummedRow.extend({ columnsToSum: ['name', 'value'], multiplier: 'multiplier' }),
  body: window.Backgrid.SummedColumnBody.extend({ columnsToSum: ['name', 'value'] })
});

document.body.appendChild(grid.render().el);
```

#### Step 2)
```
???
```

#### Step 3)
```
profit
```

* * *

### Summing the cells of a row
To sum the cells of a row, you'll want to override the `row` option in `Backgrid.Grid`, like so:
```javascript
var grid = new Backgrid.Grid({
  ...
  row: window.Backgrid.SummedRow.extend({ columnsToSum: ['name', 'value'], multiplier: 'multiplier' })
});

```

### Summing the cells of a column
To sum the cells of a column, you'll want to override the `body` option in `Backgrid.Grid`, like so:
```javascript
var grid = new Backgrid.Grid({
  ...
  body: window.Backgrid.SummedColumnBody.extend({ columnsToSum: ['name', 'value'] })
});

```

### Parameters
#### columnsToSum
`columnsToSum` is optional. If omitted, all columns will be summed.
#### multiplier
`multiplier` is optional. It can be a `Number`, or it can be a `String` representing the `name` of the column.
