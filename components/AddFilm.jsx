'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
    DocumentTitle = require('react-document-title');

var config = require('../js/config.js');


var AddFilm = React.createClass({

    mixins: [ Router.Navigation,Router.State ],

    getInitialState:function(){

      return{
        name:'',
        message:'',
        imagen:'',
        year:'',
        errorClass:'',
        pelicula:'',
        no_available:'hidden'
        };
    },
    setName:function(e){
      this.setState({name:e.target.value});
    },
    setImagen:function(e){
      this.setState({imagen:e.target.value});
    },
    setYear:function(e){
      this.setState({year:e.target.value});
    },
    setErrors:function(errors){
      this.setState({message:errors});
    },
    clearAndFocusInput:function(e){
      this.setState({message:'Error.Película Ya creada'})
      this.setState({
        errorClass:'errorLogIn'
      });
      // Clear the input
      this.setState({name: ''}, function() {
        // This code executes after the component is re-rendered
        this.refs.theInput.getDOMNode().focus();   // Boom! Focused!
      });
      this.setState({
        pelicula:'redBorder'
      });

    },
    updateApi:function(imagen,year){
      this.setState({'imagen':imagen});
      this.setState({'year':year});
      this.handlePost();
    },
    handlePost:function(){

      request
            .get(config.api+'registro_pelicula?nombre='+this.state.name+
              "&imagen="+this.state.imagen+"&year="+this.state.year.toString())
            .end(function(res){
              result = JSON.parse(res.text);
              if(result[0]["Resultado"] === 200){
                this.transitionTo('/films');
              }
              else if(result[0]["Resultado"] === 500){
                this.clearAndFocusInput();
              }
              else if(result[0]["Resultado"] === 501){
                console.log('Faltan Parámetros');
              }
            }.bind(this));
    },
    handleError:function(){
      this.setState({message:'Error.Película no disponible'})
      this.setState({
        errorClass:'errorLogIn'
      });
      // Clear the input
      this.setState({name: ''}, function() {
        // This code executes after the component is re-rendered
        this.refs.theInput.getDOMNode().focus();   // Boom! Focused!
      });
      this.setState({
        pelicula:'redBorder',
        no_available:''
      });

    },
    handleForm:function(e){
      e.preventDefault();

      if(this.state.no_available === ""){
        this.handlePost();
      }
      else{
        var name  = this.state.name;
        var imagen = "";
        var year;
        request
              .get('http://yts.re/api/v2/list_movies.json?query_term='+name)
              .end(function(res){
                result = JSON.parse(res.text);
                if(result.data.movies.length > 0){
                  var imagen = result.data.movies[0].medium_cover_image;
                  var year  = result.data.movies[0].year;
                  this.updateApi(imagen,year);
                }
                else{
                  this.handleError();
                }
              }.bind(this));
      }


    },
    render:function(){
    return(
      <DocumentTitle title="Add Film">
        <div>
            <p id="errorForm" className={this.state.errorClass}>{this.state.message}</p>
          <form onSubmit={this.handleForm} id="addFilm" method="post"  role="form">
            <label className="is-required">Nombre</label>
            <input ref="theInput" className={this.state.pelicula} type="text"  name="name" onChange={this.setName} id="name" required placeholder="Nombre" value={this.state.name}></input>
            <div className={this.state.no_available}>
              <label className="is-required">Imagen</label>
              <input type="text" id="imagen" onChange={this.setImagen} placeholder="Imagen"/>
              <label className="is-required">Año</label>
              <input type="text" id="year" onChange={this.setYear} placeholder="Año"/>
            </div>
            <input  type="submit"  value="Enviar"></input>
          </form>
       </div>
   </DocumentTitle>
    )
  }
  });


  module.exports = AddFilm;
