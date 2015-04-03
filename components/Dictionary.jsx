'use strict';
var React    = require('react');
var Router = require('react-router');
var DocumentTitle = require('react-document-title');
var request  = require('superagent');
var Table = require('reactabular').Table;
var Search = require('reactabular').Search;
var Paginator = require('react-pagify');
var sortColumn = require('reactabular').sortColumn;




var columns = [
    {
        property: 'english',
        header: 'English',
    },
    {
        property: 'spanish',
        header: 'Spanish',
    },
    {
        property: 'pelicula',
        header: 'Pelicula',
    },
    {
        property:'serie',
        header:'Serie'
    },
    {
        property:'episodio',
        header:'Episodio'
    }
];

var header = {
  onClick:function(){
    sortColumn(
           this.state.columns,
           column,
           this.state.searchData,
           this.setState.bind(this)
       );
  }
}


var Dictionary = React.createClass({
  mixins: [ Router.Navigation,Router.State ],
  getInitialState:function() {
    return {
        data:'',
        searchData: '',
        pagination:{
          page:0,
          perPage:10
        },
    };
},
componentDidMount: function() {
  request.get('http://localhost:5412/web/palabras',function(res){
    res = JSON.parse(res.text);
    if (this.isMounted()) {
      this.setState({
        data:res,
        searchData:res
      });
  }
  }.bind(this));
},
// handlers
onSelect:function(page) {
    var pagination = this.state.pagination || {};

    pagination.page = page;

    this.setState({
        pagination: pagination
    });
},

onPerPage:function(e) {
    var pagination = this.state.pagination || {};

    pagination.perPage = parseInt(event.target.value, 10);

    this.setState({
        pagination: pagination
    });
},

addWords:function(){
  this.transitionTo('/AddWords');
},

  render: function () {
    var data = this.state.data;
    var pagination = this.state.pagination || {};
    var searchData = this.state.searchData;
    var paginated = Paginator.paginate(searchData, pagination);

    if(this.state.changeLocation === true){
      return <AddDictionary/>;
    }
    if(this.state.data === ''){
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
      return (
        <DocumentTitle title="Dictionary">
          <div className="table-react">
            <div className="dictionaryButton">
              <button className="addWords" onClick={this.addWords}>ADD WORDS</button>
            </div>
            <div className='per-page-container'>
                Results <input type='text' defaultValue={pagination.perPage} onChange={this.onPerPage}></input>
          </div>
            <div className='search-container'>
                Search <Search columns={columns} data={data} onResult={this.setState.bind(this)}></Search>
            </div>
            <Table columns={columns} data={paginated.data} ></Table>
              <div className='pagination'>
                <Paginator
                    page={paginated.page}
                    pages={paginated.amount}
                    beginPages='3'
                    endPages='3'
                    onSelect={this.onSelect}>
               </Paginator>
            </div>
        </div>
        </DocumentTitle>
      )
    }


  }
});

module.exports = Dictionary;
