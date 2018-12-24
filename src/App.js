import React, { Component } from 'react';
import './App.css';
import { create } from 'apisauce'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// define the api
const api = create({
  baseURL: 'http://localhost:8000/api/v1/',
})

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      children: null,
      logData: []
    }
  }


  componentDidMount() {
    this.getQuestion()
  }

  getQuestion = (parent_id=null, text=null) => {
    let api_url = '/topic/'
    if(parent_id && text)
      api_url = api_url+parent_id+'/'+text+'/'

    api
      .get(api_url)
      .then((response) => {
        this.setState({
          data: response.data[0],
          children: response.data[0].children
        })
      })
  }

  handleButtonClick = (parent_id, child_id, text, child_text) => {
      let {logData} = this.state
      if(logData.length === 0){
        logData.push(text)
        logData.push(child_text)
      }
      else
        logData.push(child_text)
      this.setState({logData})
      this.getQuestion(parent_id, child_id)
  }

  postLog = (text) => {
    let {logData} = this.state
    let separator = " --> "
    let postString = logData.join(separator)

    api
      .post('/log/', {log: postString})
      .then((response) => {
        return response
      }).catch(error => console.log(error))
  }

  render() {
    let { data, children} = this.state

    return (
      <div className="App">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <header className="App-header">
              <h1>
                Please select the options below.
          </h1>
            </header>
          </Grid>
          <Grid item xs={12}>

          
            <h3>
              {data.text}
            </h3>
            {children && children.map((child, index) =>
              { 
                return child.count > 0 ? <Button variant="contained" 
                color="primary" key={index} 
                className="App-button"
                onClick={() => { this.handleButtonClick(data.pk, child.pk, data.text, child.text) }}
                >
                  {child.text}
                </Button>
                : (
                    <div key={index}>
                      {this.postLog()}
                      <p>{child.text}</p>
                    </div>
                )

              }
              
            )}

          </Grid>


        </Grid>

      </div>
    );
  }
}

export default App;
