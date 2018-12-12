import React from "react";
import { render } from "react-dom";
import { throttle, debounce } from "throttle-debounce";
import School from "./School.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { q: "", schoolID: null };
    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch);
    this.autocompleteSearchThrottled = throttle(200, this.autocompleteSearch);
  }

  changeQuery = event => {
    this.setState({ q: event.target.value }, () => {
      const q = this.state.q;
      if (q.length < 5 || q.endsWith(' ')) {
        this.autocompleteSearchThrottled(this.state.q.trim());
      } else {
        this.autocompleteSearchDebounced(this.state.q.trim());
      }
    });
  };

  autocompleteSearch = q => {
	  let url = '/api/search/' + q
	  fetch(url)
    .then(res => res.json())
    .then(res => { 
        this.setState({
          schoolResults: res
        })
    })
  };

  clickHandler = (id) => {
	this.setState({ schoolResults: [], q: "", schoolID: id })
	console.log(id);  
  }

  render() {
    const results = this.state.schoolResults || [];
    return (
      <div className="m-4">
        <h2 className="text-primary">School Search Demo</h2>
        <p>
          Type the name of a college/post-secondary school below to get its demo report.
        </p>
        <input
          className="rounded"
          placeholder="Type school here"
          type="text"
          value={this.state.q}
          onChange={this.changeQuery}
        />
        <hr />
        {results.length ? (
          <button
            type="button"
            onClick={event => this.setState({ schoolResults: [], q: "" })}
          >
            Clear
          </button>
        ) : null}
        {results.map ? (
        <ul>
          {results.map((item) => {
            return <li key={item.id} onClick={() => this.clickHandler(item.id)}>{item['school.name']}</li>;
          })}
        </ul>
        ) : null }
        <School schoolID={ this.state.schoolID } />
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
