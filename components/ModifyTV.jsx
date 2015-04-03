'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
DocumentTitle = require('react-document-title');

var config = require('../js/config.js');


function getSerie(ID,callback){
  request.get(config.api+'serie?ID='+ID).end(function(res){
    var res = JSON.parse(res.text);
    return callback(res[0]);
  });
}


var ModifyTV = React.createClass({
    mixins:[ Router.Navigation,Router.State ],

    getInitialState:function(){
      return{
        name:'',
        message:'',
        imagen:'',
        year:'',
        temporada:'',
        errorClass:'',
        pelicula:''
        };
    },
    componentDidMount: function() {
      var id = this.getParams().id;
      var _this = this;
      var data = getSerie(id,function(result){

          _this.setState({
            name:result.Nombre,
            imagen:result.Imagen,
            year:result.Year,
            temporada:result.Temporada
          });

      });

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
      this.setState({name: ''}, function() {
        // This code executes after the component is re-rendered
        this.refs.theInput.getDOMNode().focus();   // Boom! Focused!
      });
      this.setState({
        pelicula:'redBorder'
      });
    },
    handleError:function(){
      this.setState({message:'Error.Serie no disponible'})
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
      })
    },
    handlePost:function(){
      request
            .get('http://localhost:5412/web/modificar_pelicula?name='+this.state.name+
              "&anterior="+this.state.anterior+
              "&imagen="+this.state.imagen+
              "&year="+this.state.year.toString())+
              "&temporada="+this.state.temporada
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
    render:function(){

    return(
      <DocumentTitle title="Modify TV SHOW">
        <div>
          <p id="errorForm" className={this.state.errorClass}>{this.state.message}</p>
          <form onSubmit={this.handleForm} id="addFilm" method="post"  role="form">
            <label className="is-required">Nombre</label>
            <input ref="theInput" className={this.state.pelicula}
                  type="text"  name="name"
                  onChange={this.setName} id="name"
                  required placeholder="Nombre"
                  value={this.state.name}></input>
            <label className="is-required">Temporada</label>
            <input type="number"  id="temporada"
              onChange={this.setTemporada} value={this.state.temporada} placeholder="Temporada"/>
            <label className="is-required">Imagen</label>
            <input type="text" id="imagen" onChange={this.setImagen} value={this.state.imagen} placeholder="Imagen"/>
            <label className="is-required">Año</label>
            <input type="text" id="year" onChange={this.setYear} value={this.state.year} placeholder="Año"/>
            <input  type="submit"  value="Enviar"></input>
          </form>
       </div>
     </DocumentTitle>
    )
  }
  });

module.exports = ModifyTV;
