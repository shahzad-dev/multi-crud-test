import React from 'react';
import Relay from 'react-relay';
import List from '../../shared/List';
import HobbyItem from './HobbyItem';
import hobbyAddMutation from './mutations/hobbyAddMutation';

class HobbiesList extends List {

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  }

  _getItem = ( node ) => {
    return (<HobbyItem
              hobby={ node }
              Viewer={this.props.Viewer} />)
  }

  _handle_OnChange = ( event ) => {
      this.context.relay.commitUpdate(
        new hobbyAddMutation( {
          title: this.refs.title.value,
          Viewer: this.props.Viewer
        } )
      )
   }
}

export default Relay.createContainer(HobbiesList, {
  fragments: {
    Viewer: () => Relay.QL`
      fragment on Viewer {
        hobbies(first: 100) {
          edges {
            node {
              id,
              title,
              ${HobbyItem.getFragment('hobby')},
            },
          },
        },
        ${hobbyAddMutation.getFragment('Viewer')},
        ${HobbyItem.getFragment('Viewer')},
      }
    `,
  },
});
