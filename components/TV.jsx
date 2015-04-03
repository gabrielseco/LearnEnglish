'use strict';
var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
DocumentTitle = require('react-document-title');


var config = require('../js/config.js');


var TV = React.createClass({
    mixins: [ Router.Navigation,Router.State ],
    getInitialState:function(){
      return{tv:''};
    },
    componentDidMount: function() {
        request.get(config.api+'series',function(res){
          res = JSON.parse(res.text);
          if (this.isMounted()) {
            this.setState({
              tv:res
            });
        }
      }.bind(this));
    },
    addTV:function(){
      this.transitionTo('/AddTV');
    },
    clickHandler:function(id){
      this.transitionTo('/ModifyTV/:id',{id:id});
    },
    episodes:function(id){
      this.transitionTo('/Episodes/:id',{id:id})
    },
    render:function(){
      if(this.state.tv === ''){
        return(
          <DocumentTitle title="TV">
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
          var list = this.state.tv.map(function(tv){
            var ID = tv.ID;
            var title = tv.Nombre + " - SEASON "+tv.Temporada;
            return <li key={tv.ID}>
                      <div className="imagen">
                      <img  onClick={this.clickHandler.bind(this,ID)}
                            src={tv.Foto}
                            title={title}
                            alt={title}
                            width="230"
                            height="345"/>
                      </div>
                      <div className="episodes">
                            <button onClick={this.episodes.bind(this,ID)}>EPISODES</button>
                      </div>

                    </li>;
          },this);

          return(
              <DocumentTitle title="TV SHOWS">
              <div className="tv">
                <div className="tvButton">
                  <button className="addTV" onClick={this.addTV}>ADD TV SHOW</button>
                </div>
                <ul className="tv">
                  {list}
                </ul>
              </div>
            </DocumentTitle>
          )
      }
      }
});

module.exports = TV;
