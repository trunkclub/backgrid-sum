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
  row: window.Backgrid.SummedRow,
  body: window.Backgrid.SummedColumnBody
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
