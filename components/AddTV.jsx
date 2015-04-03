'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
    DocumentTitle = require('react-document-title');

var config = require('../js/config.js');


var AddTV = React.createClass({

    mixins: [ Router.Navigation,Router.State ],

    getInitialState:function(){

      return{
        name:'',
        message:'',
        imagen:'',
        year:'',
        temporada:'',
        errorClass:'',
        pelicula:'',
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
    setTemporada:function(e){
      this.setState({temporada:e.target.value});
    },
    setErrors:function(errors){
      this.setState({message:errors});
    },
    clearAndFocusInput:function(e){
      this.setState({message:'Error.Serie Ya creada'})
      this.setState({
        errorClass:'errorLogIn'
      });
      // Clear the input
      this.setState({name: '',}, function() {
        // This code executes after the component is re-rendered
        this.refs.theInput.getDOMNode().focus();   // Boom! Focused!
      });
      this.setState({
        pelicula:'redBorder',
        temporada:'',
        imagen:'',
        year:''
      });

    },
    handleForm:function(e){
      e.preventDefault();
      request
            .get(config.api+'registro_series?nombre='+this.state.name+
              "&imagen="+this.state.imagen+"&year="+this.state.year.toString()+"&temporada="+this.state.temporada)
            .end(function(res){
              result = JSON.parse(res.text);
              if(result[0]["Resultado"] === 200){
                this.transitionTo('/tv');
              }
              else if(result[0]["Resultado"] === 500){
                this.clearAndFocusInput();
              }
              else if(result[0]["Resultado"] === 501){
                console.log('Faltan Parámetros');
              }
            }.bind(this));
    },
    render:function(){
    return(
      <DocumentTitle title="Add TV Show">
        <div>
            <p id="errorForm" className={this.state.errorClass}>{this.state.message}</p>
          <form onSubmit={this.handleForm} id="addTV" method="post"  role="form">
            <label className="is-required">Nombre</label>
            <input ref="theInput" className={this.state.pelicula} type="text"
              name="name" onChange={this.setName} id="name"
              required placeholder="Nombre" value={this.state.name}></input>
            <label className="is-required">Temporada</label>
            <input type="number" id="temporada" onChange={this.setTemporada}
                   placeholder="Temporada" className={this.state.pelicula}
                   value={this.state.temporada}/>
            <label className="is-required">Imagen</label>
            <input type="text" id="imagen" onChange={this.setImagen}
              placeholder="Imagen" className={this.state.pelicula}
              value={this.state.imagen}/>
            <label className="is-required">Año</label>
            <input type="text" id="year" onChange={this.setYear}
              placeholder="Año" className={this.state.pelicula}
              value={this.state.year}/>
            <input  type="submit"  value="Enviar"></input>
          </form>
       </div>
   </DocumentTitle>
    )
  }
  });


  module.exports = AddTV;
