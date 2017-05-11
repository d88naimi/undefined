const handlebars = require('hbs');
const config = require('./index');
const path = require('path');

handlebars.registerHelper("switch", function(value, options) {
  this._switch_value_ = value;
  var html = options.fn(this); // Process the body of the switch block
  delete this._switch_value_;
  return html;
});

handlebars.registerHelper("case", function(value, options) {
  if (value == this._switch_value_) {
    return options.fn(this);
  }
});
handlebars.registerHelper('json', object => JSON.stringify(object));

handlebars.registerPartials(path.join(config.root, '/app/views/partials'));

module.exports = handlebars;