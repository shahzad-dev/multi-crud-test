import React from 'react';

export default class Item extends React.Component {
  
    constructor( props, context ) {
      super( props, context );
      this.state = {
        title: this.props.hobby.title
      }
    }

    _bind = (...methods) => methods.forEach( (method) => this[method] = this[method].bind(this) )
    _handle_OnChange = ( evt ) => {}
    _handle_DeleteChange = ( evt ) => {}

    render() {
      return (
        <div style={{marginBottom: 10}}>
            <strong>Edit Mode</strong><br/>
            Title: <input type="text" ref="title" defaultValue={this.state.title} />
            <input type="button" value="Update" onClick={this._handle_OnChange} />
            <input type="button" value="Delete" onClick={this._handle_DeleteChange} />
        </div>
      );
    }
}
