'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
DocumentTitle = require('react-document-title');

var ModifyFilm = React.createClass({
    mixins:[ Router.Navigation,Router.State ],

    getInitialState:function(){

      return{
        name:'',
        message:'',
        anterior:'',
        imagen:'',
        year:'',
        errorClass:'',
        pelicula:''
        };
    },
    componentDidMount: function() {
      var name = this.getParams().name;

      this.setState({
        anterior:name,
        name:name
      });

    },
    setName:function(e){
      this.setState({name:e.target.value});
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
        pelicula:'redBorder'
      })
    },
    updateApi:function(imagen,year){
      this.setState({'imagen':imagen});
      this.setState({'year':year});
      this.handlePost();
    },
    handlePost:function(){
      request
            .get('http://localhost:5412/web/modificar_pelicula?name='+this.state.name+
              "&anterior="+this.state.anterior+
              "&imagen="+this.state.imagen+
              "&year="+this.state.year.toString())
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
    handleForm:function(e){
      e.preventDefault();

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
    },
    render:function(){
    return(
      <DocumentTitle title="Modify Film">
        <div>
          <p id="errorForm" className={this.state.errorClass}>{this.state.message}</p>
          <form onSubmit={this.handleForm} id="addFilm" method="post"  role="form">
            <label className="is-required">Nombre</label>
            <input ref="theInput" type="text"
                   name="name" onChange={this.setName} id="name"
                   required placeholder="Nombre"
                   value={this.state.name}
                   className={this.state.pelicula}></input>
            <input  type="submit"  value="Enviar"></input>
          </form>
       </div>
     </DocumentTitle>
    )
  }
  });

module.exports = ModifyFilm;
