import React from 'react';
import Relay from 'react-relay';
import HobbyItem from './units/Hobbies/HobbyItem';
import HobbiesList from './units/Hobbies';
import Viewer_updateMutation from './Viewer_updateMutation';

class App extends React.Component {

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  }

  _handleUpdate = ( ) =>
  {
    this.context.relay.commitUpdate(
      new Viewer_updateMutation( {
        Viewer: this.props.Viewer,
        email: this.refs.email.value,
      } )
    );
  }
  render() {
      console.log(this.props);
    return (
        <div>
          <strong>Email: </strong> {this.props.Viewer.email}<br/>
        <input type="text" ref="email" />
          <button onClick={this._handleUpdate.bind(this)}>Update</button>
          <br/><br/>
          <u><strong>Connection Type with Mutation feature:</strong></u>
          <HobbiesList Viewer={this.props.Viewer} />
          <br/>
          <strong>Teas (List Type)</strong>
          <ul>
              {this.props.store.teas.map(
                (tea, key) => <Tea tea={tea} key={key}/>
              )}
           </ul>

        <strong>Hobbies Again (Object or Connection Type)</strong>
        <ul>
            {this.props.store.hobbies.edges.map(
              (edge, key) => <Hobby key={key} hobby={ edge.node } />
            )}
          </ul>


        </div>)
  }
}

//The Tea has been used to test list type
class Tea extends React.Component {
  render() {
    var {name, steepingTime} = this.props.tea;
    return (
      <li key={name}>
        {name} (<em>{steepingTime} min</em>)
      </li>
    );
  }
}

Tea = Relay.createContainer(Tea, {
  fragments: {
    tea: () => Relay.QL`
      fragment on Tea {
        name,
        steepingTime,
      }
    `,
  },
});

//The Tea has been used to test list type
class Hobby extends React.Component {
  render() {
    var {id, title} = this.props.hobby;
    return (
      <li key={id}>
        {title}
      </li>
    );
  }
}

Hobby = Relay.createContainer(Hobby, {
  fragments: {
    hobby: () => Relay.QL`
      fragment on Hobby {
          id,
          title
      }
    `,
  },
});


export default Relay.createContainer(App, {
  fragments: {
    store: () => Relay.QL`
        fragment on Store {
            teas { ${Tea.getFragment('tea')} },

            hobbies(first: 100) {
              edges {
                node {
                  ${Hobby.getFragment('hobby')},
                },
              },
            }
        }
      `,

    Viewer: () => Relay.QL`
      fragment on Viewer {
        id,
        email,
        ${Viewer_updateMutation.getFragment('Viewer')}
        ${HobbiesList.getFragment('Viewer')},
      }
    `,
  },
});
