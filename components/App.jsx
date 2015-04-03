"use strict";

var React         = require('react');
var Router        = require('react-router');
var DocumentTitle = require('react-document-title');

var RouteHandler  = Router.RouteHandler;
var Link          = Router.Link;

var Header = require('./Header');

var title = "Learn Films";

var App = React.createClass({

  getDefaultProps: function () {
    return {};
  },

  render: function () {

    return (
      <DocumentTitle title={ title }>
        <div className="app">
          <Header></Header>
          <div className="detail">
            <RouteHandler />
          </div>
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = App;
