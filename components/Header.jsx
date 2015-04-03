"use strict";

var React         = require('react');
var Router        = require('react-router');

var Link          = Router.Link;

var Header = React.createClass({
  render: function () {
    return(

      <div className="bar">
        <li><Link className="item" to="films">Films</Link></li>
        <li><Link className="item" to="tv">TV Shows</Link></li>
        <li><Link className="item" to="dictionary">Dictionary</Link></li>
        <li className="bar-button"><Link className="item" to="login">Log In</Link></li>
      </div>
  )
  }
});

module.exports = Header;
