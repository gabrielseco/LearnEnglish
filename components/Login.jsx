"use strict";

var React         = require('react');
var Router        = require('react-router');
var request       = require('superagent');
var Link          = Router.Link;



var Login = React.createClass({

    getInitialState:function(){
      return{user:'',pass:'',message:''};
    },
    setUser:function(e){
      this.setState({user:e.target.value});
    },
    setPass:function(e){
      this.setState({pass:e.target.value});
    },
    setErrors:function(errors){
      this.setState({message:errors});
    },
    clearAndFocusInput: function() {

      this.setState({message:'Error.Usuario o contraseña incorrectos'})
      $("#errorForm").addClass('errorLogIn');
      // Clear the input
      this.setState({pass: ''}, function() {
        // This code executes after the component is re-rendered
        this.refs.theInput.getDOMNode().focus();   // Boom! Focused!
      });
      $("#password").addClass("redBorder");
      $("#username").addClass("redBorder");
    },
    handleForm:function(e){
      e.preventDefault();

      var username = this.state.user;
      var password = this.state.pass;
      
      $.ajax({
        'url':'http://localhost:5412/web/login',
         data: {'username':username,'password':password},
         success:function(result){
           result = JSON.parse(result);

           if(result[0]["Resultado"] === 200){
             window.location.href="films.html";
             sessionStorage.setItem('cookiePass',result[0]["Token"]);
           }
           else if(result[0]["Resultado"] === 500){
             this.clearAndFocusInput();
           }
         }.bind(this),
         error:function(xhr){
           console.log('error ajax' +xhr.responseText);
         }
      });
    },
    render:function(){
    return(
      <div>
        <div id="errorForm">
          <p >{this.state.message}</p>
        </div>
      <form onSubmit={this.handleForm} id="loginForm" method="post"  role="form">
        <label className="is-required">User</label>
        <input type="text"  name="username" onChange={this.setUser} id="username" required placeholder="User" value={this.state.user}></input>
        <label className="is-required">Password</label>
        <input ref="theInput"  type="password"  name="password" onChange={this.setPass} id="password" value={this.state.pass} required placeholder="Password"></input>
        <input  type="submit"  value="Log In"></input>
      </form>
    </div>
    )
  }
  });

module.exports = Login;
