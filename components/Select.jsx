'use strict';
var React = require('react'),
    request = require('superagent');

var Select = React.createClass({

    getInitialState:function(){
      return{films:'',id:''};
    },
    componentDidMount: function() {
      request.get(this.props.source,function(res){
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
    onSelect:function(e){
      this.setState({id:e.target.value});
    },
    render:function(){
      if(this.state.films === ''){
        return(
          <div className="sk-spinner sk-spinner-wave">
                <div className="sk-rect1"></div>
                <div className="sk-rect2"></div>
                <div className="sk-rect3"></div>
                <div className="sk-rect4"></div>
                <div className="sk-rect5"></div>
          </div>
        )
      }
      else{
          var list = this.state.films.map(function(film){
            return      <option key={film.ID} value={film.ID}>
                          {film.Nombre} {this.props.separator} {film[this.props.parameters]}
                        </option>;
          },this);

          return(
            <div className={this.props.class}>
              <select onChange={this.onSelect}>
                <option value="0">{this.props.text}</option>
                {list}
              </select>
              <input type="hidden" id={this.props.ID} value={this.state.id}/>
              <input type="submit" value="ENVIAR"></input>
            </div>
          )
      }
  }
});


module.exports = Select;
