'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
DocumentTitle = require('react-document-title');

var config = require('../js/config.js');


var Film = React.createClass({
    mixins: [ Router.Navigation,Router.State ],
    getInitialState:function(){
      return{films:''};
    },
    componentDidMount: function() {
     request.get(config.api+'peliculas',function(res){
       res = JSON.parse(res.text);
       if (this.isMounted()) {
         this.setState({
           films:res
         });
     }
   }.bind(this));
  },
    setErrors:function(errors){
      this.setState({message:errors});
    },
    clickHandler:function(id){
      this.transitionTo('/ModifyFilm/:name',{name:id});
    },
    addFilm:function(){
      this.transitionTo('/AddFilm');
    },
    render:function(){
      if(this.state.films === ''){
        return(
          <DocumentTitle title="Films">
            <div className="sk-spinner sk-spinner-wave">
                  <div className="sk-rect1"></div>
                  <div className="sk-rect2"></div>
                  <div className="sk-rect3"></div>
                  <div className="sk-rect4"></div>
                  <div className="sk-rect5"></div>
            </div>
        </DocumentTitle>
        )
      }
      else{
          var list = this.state.films.map(function(film){
            var name = film.Nombre;
            return <li key={film.ID}>
                      <img onClick={this.clickHandler.bind(this,name)}
                            src={film.Foto}
                            title={film.Nombre}
                            alt={film.Nombre}
                            width="230"
                            height="345"/>
                    </li>;
          },this);

          return(
            <DocumentTitle title="Films">
            <div className="films">
              <div className="filmButton">
                <button className="addFilm" onClick={this.addFilm}>ADD FILM</button>
              </div>
              <ul className="films">
                {list}
              </ul>
            </div>
          </DocumentTitle>
          )
      }
  }
});

module.exports = Film;
