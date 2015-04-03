'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
    DocumentTitle = require('react-document-title');

var Select = require('./Select');

var config = require('../js/config.js');

var AddDictionary = React.createClass({

    mixins: [ Router.Navigation,Router.State ],
    getInitialState:function(){
      return{
        message:'',
        id:'',
        data:[],
        english:'',
        spanish:'',
        formulario:'hidden',
        select:'',
        errorInput:'',
        form1:true,
        films:false,
        series:false,
        episode:false,
        idSerie:'',
        idEpisode:''
      }
    },

    setErrors:function(errors){
      this.setState({message:errors});
    },
    handleForm:function(e){
      e.preventDefault();
      var id = document.getElementById('IDPelicula').value;
      this.setState({id:id});

      this.setState({
        formulario:''
      });

      this.setState({
        select:'hidden'
      });
    },
    handleWordsSeries:function(data){
      for(i=0;i<data.length;i++){
        var obj  = data[i];
        request
              .get(config.api+'registro_palabra?english='+obj.english+
                "&spanish="+obj.spanish+"&ID_SERIE="+this.state.idSerie.toString()+
                "&ID_EPISODIO="+this.state.idEpisode.toString())
              .end(function(res){
                result = JSON.parse(res.text);
                if(result[0]["Resultado"] === 200){
                  console.log('Exito');
                }
                else if(result[0]["Resultado"] === 500){
                  console.log('Error con la palabra'+obj.english);
                }
                else if(result[0]["Resultado"] === 501){
                  console.log('Faltan Parámetros');
                }
              }.bind(this));

    }

    },
    handleWords:function(){
      var data = this.state.data;

      if(this.state.idSerie){
        this.handleWordsSeries(data);
      }
      else{
        for(i=0;i<data.length;i++){
          var obj  = data[i];

          request
                .get(config.api+'registro_palabra?english='+obj.english+
                  "&spanish="+obj.spanish+"&id="+obj.id.toString())
                .end(function(res){
                  result = JSON.parse(res.text);
                  if(result[0]["Resultado"] === 200){
                    console.log('Exito');
                  }
                  else if(result[0]["Resultado"] === 500){
                    console.log('Error con la palabra'+obj.english);
                  }
                  else if(result[0]["Resultado"] === 501){
                    console.log('Faltan Parámetros');
                  }
                }.bind(this));

        }
      }
      this.transitionTo("/dictionary");
    },
    handleEnglish:function(e){
      this.setState({english:e.target.value});
    },
    handleSpanish:function(e){
      this.setState({spanish:e.target.value});
    },
    handleChange:function(e){
      var data = this.state.data;
      if(this.state.english === '' || this.state.spanish === ''){
        this.errorInputs();
      }
      else{
        var parameters = {'english':this.state.english,'spanish':this.state.spanish,'id':this.state.id};
        data.push(parameters);
        this.setState({data:data});
        this.clearInputs();
      }
    },
    clearInputs:function(){
      this.setState({english:'',spanish:''});
      this.setState({
        errorInput:''
      });
      this.refs.theInput.getDOMNode().focus();
    },
    errorInputs:function(){
      this.refs.theInput.getDOMNode().focus();
      this.setState({
        errorInput:'redBorder'
      });
    },
    handleFilms:function(){
      this.setState({
        films:true,
        form1:false
      })
    },
    handleSeries:function(){
      this.setState({
        series:true,
        form1:false
      });
    },
    saveIDSerie:function(e){
      e.preventDefault();
      var id = document.getElementById('IDSerie').value;

      this.setState({
        idSerie:id,
        series:false,
        episode:true
      });

    },

    saveIDEpisode:function(e){
      e.preventDefault();
      var id = document.getElementById('IDEpisode').value;
      this.setState({idEpisode:id});

      this.setState({
        formulario:''
      });

      this.setState({
        select:'hidden'
      });
    },
    renderFilms:function(){
      var URL = config.api + "peliculas";
      return(
        <DocumentTitle title="Add Words to Dictionary">
        <div>
        <form onSubmit={this.handleForm} id="selectName" method="post"  role="form">
          <Select
                  ID="IDPelicula"
                  text="Seleccione Película"
                  source={URL}
                  class={this.state.select}>
          </Select>
        </form>
        <form id="addWorld" className={this.state.formulario}
          method="post"  role="form">
          <input type="text"
                name="English"
                id="English"
                onChange={this.handleEnglish}
                required
                placeholder="Inglés"
                value={this.state.english}
                ref="theInput"
                className={this.state.errorInput}>
          </input>
          <input type="text"
                      name="Spanish"
                      id="Spanish"
                      onChange={this.handleSpanish}
                      required
                      placeholder="Español"
                      value={this.state.spanish}
                      ref="spanish"
                      className={this.state.errorInput}>
         </input>
          <input type="button" value="Siguiente" onClick={this.handleChange}></input>
          <input type="button" value="Finalizar" onClick={this.handleWords}></input>
        </form>
        </div>
      </DocumentTitle>
    )
    },
    renderSeries:function(){
      var URL = config.api + "series";
      return(
        <DocumentTitle title="Add Words to Dictionary">
          <div>
            <form onSubmit={this.saveIDSerie} id="selectSerie" method="post"  role="form">
              <Select ID="IDSerie"
                      text="Seleccione Serie"
                      source={URL}
                      separator=" - Season"
                      parameters="Temporada"
                      class={this.state.select}></Select>
            </form>
            </div>
      </DocumentTitle>
    )
    },
    renderEpisode:function(){
      //con el párrafo no rompe WTF
      var ID = this.state.idSerie;
      var URL = config.api+"episodios?ID="+ID;
      return(
        <DocumentTitle title="Add Words to Dictionary">
          <div>
            <p></p>
            <form onSubmit={this.saveIDEpisode} id="selectEpisode" method="post"  role="form">
              <Select ID="IDEpisode"
                      text="Seleccione Episodio"
                      source={URL}
                      class={this.state.select}>
              </Select>
            </form>

            <form id="addWorld" className={this.state.formulario}
              method="post"  role="form">
              <input type="text"
                    name="English"
                    id="English"
                    onChange={this.handleEnglish}
                    required
                    placeholder="Inglés"
                    value={this.state.english}
                    ref="theInput"
                    className={this.state.errorInput}>
              </input>
              <input type="text"
                          name="Spanish"
                          id="Spanish"
                          onChange={this.handleSpanish}
                          required
                          placeholder="Español"
                          value={this.state.spanish}
                          ref="spanish"
                          className={this.state.errorInput}>
             </input>
              <input type="button" value="Siguiente" onClick={this.handleChange}></input>
              <input type="button" value="Finalizar" onClick={this.handleWords}></input>
            </form>
          </div>
      </DocumentTitle>
    )
    },
    choose:function(){
      return(
        <DocumentTitle title="Add Words to Dictionary">
          <div>
            <div className="optionDictionary">
              <button onClick={this.handleFilms}>Peliculas</button>
              <button onClick={this.handleSeries}>Series</button>
            </div>
          </div>
      </DocumentTitle>
    )
    },
    render:function(){
      if(this.state.form1){
        return(this.choose())
      }

      if(this.state.films){
        return(this.renderFilms());
      }

      if(this.state.series){
        return(this.renderSeries());
      }

      if(this.state.episode){
        return(this.renderEpisode());
      }



      }
});


module.exports = AddDictionary;
