'use strict';

var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

/* Components */
var App                 = require('./components/App.jsx');
var Index               = require('./components/Index.jsx');
var NotFound            = require('./components/NotFound.jsx');
var Films               = require('./components/Films.jsx');
var AddFilm             = require('./components/AddFilm.jsx');
var ModifyFilm          = require('./components/ModifyFilm.jsx');
var TV                  = require('./components/TV.jsx');
var AddTV               = require('./components/AddTV.jsx');
var ModifyTV            = require('./components/ModifyTV.jsx');
var Dictionary          = require('./components/Dictionary.jsx');
var AddDictionary       = require('./components/AddDictionary.jsx');
var Episodes            = require('./components/Episodes.jsx');
var AddEpisode          = require('./components/AddEpisode.jsx');
var Login               = require('./components/Login.jsx');


var routes = (
  <Route name="places" path="/" handler={App}>
    <DefaultRoute name="index" handler={Index} />
    <Route name="films" path="films" handler={Films} />
    <Route name="AddFilm" path="AddFilm" handler={AddFilm} />
    <Route name="ModifyFilm" path="ModifyFilm/:name" handler={ModifyFilm} />
    <Route name="tv" path="tv" handler={TV} />
    <Route name="addTV" path="AddTV" handler={AddTV}/>
    <Route name="modifyTV" path="ModifyTV/:id" handler={ModifyTV}/>
    <Route name="episodes" path="Episodes/:id" handler={Episodes}/>
    <Route name="addEpisode" path="AddEpisode/:id" handler={AddEpisode}/>
    <Route name="dictionary" path="dictionary" handler={Dictionary} />
    <Route name="AddWords" path="AddWords" handler={AddDictionary} />
    <Route name="login" path="login" handler={Login} />
    <NotFoundRoute name="notfound" handler={ NotFound }/>
  </Route>
);

module.exports = routes;
