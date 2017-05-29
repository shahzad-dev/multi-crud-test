import React from 'react';

export default class List extends React.Component {

    constructor( props, context ) {
      super( props, context )
      this.state = {
        count: 0,
      }
    }

    _bind = (...methods) => methods.forEach( (method) => this[method] = this[method].bind(this) );
    _handle_OnChange = ( event ) => {}
    _getItem = ( node ) => {}

    render() {
      return (
        <div>
          <h3>Hobbies list (Total: {this.state.count})</h3>
          <ul>
            {this.props.Viewer.hobbies.edges.map((edge, i) =>
              <li key={i}>{edge.node.title} (ID: {i}): <br/>
                { this._getItem(edge.node) }
              </li>
            )}
          </ul>
          <fieldset>
            <legend>Form</legend>
            Title: <input type="text" ref="title" /><br/>
            <button onClick={this._handle_OnChange.bind(this)}>Add New</button>
          </fieldset>
        </div>
      );
    }
}
