'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
    DocumentTitle = require('react-document-title');

var config = require('../js/config.js');


    function getSerie(ID,callback){
      request.get(config.api+'episodio_serie?ID='+ID).end(function(res){
        var res = JSON.parse(res.text);
        return callback(res[0]);
      });
    }
var AddEpisode = React.createClass({

    mixins: [ Router.Navigation,Router.State ],

    getInitialState:function(){

      return{
        name:'',
        message:'',
        numero:'',
        serie:'',
        temporada:'',
        errorClass:'',
        };
    },
    componentDidMount: function() {
      var id = this.getParams().id;
      var _this = this;
      var data = getSerie(id,function(result){

          _this.setState({
            serie:result.Nombre,
            temporada:result.Temporada,
            numero:result.Episodio
          });

      });
    },
    setName:function(e){
      this.setState({name:e.target.value});
    },
    setNumero:function(e){
      this.setState({numero:e.target.value});
    },
    setSerie:function(e){
      this.setState({year:e.target.value});
    },
    setErrors:function(errors){
      this.setState({message:errors});
    },
    clearAndFocusInput:function(e){
      this.setState({message:'Error.Episodio Ya creado'})
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

    handleForm:function(e){
      e.preventDefault();
      var ID = this.getParams().id;

      request
            .get(config.api+'registro_episodio?nombre='+this.state.name+
              "&numero="+this.state.numero+"&ID="+ID)
            .end(function(res){
              result = JSON.parse(res.text);
              if(result[0]["Resultado"] === 200){
                this.transitionTo('/Episodes/:id',{id:ID});
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
      <DocumentTitle title="Add Episode">
        <div>
            <p id="errorForm" className={this.state.errorClass}>{this.state.message}</p>
          <form onSubmit={this.handleForm} id="addFilm" method="post"  role="form">
            {this.state.serie} - Season {this.state.temporada}
            <label className="is-required">Nombre</label>
            <input ref="theInput" className={this.state.pelicula} type="text"
              name="name" onChange={this.setName} id="name"
              required placeholder="Nombre" value={this.state.name}></input>
              <label className="is-required">Nº Episodio</label>
              <input type="number" id="numero" onChange={this.setNumero} value={this.state.numero} placeholder="Numero"/>
            <input  type="submit"  value="Enviar"></input>
          </form>
       </div>
   </DocumentTitle>
    )
  }
  });


  module.exports = AddEpisode;
