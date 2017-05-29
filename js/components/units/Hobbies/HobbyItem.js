import Relay from 'react-relay';
import hobbyUpdateMutation from './mutations/hobbyUpdateMutation';
import hobbyDeleteMutation from './mutations/hobbyDeleteMutation';
import Item from '../../shared/Item';

class HobbyItem extends Item {
    static contextTypes = {
      relay: Relay.PropTypes.Environment,
    }
    _handle_OnChange = ( evt ) => {
        this.context.relay.commitUpdate(
            new hobbyUpdateMutation( {
              hobby: this.props.hobby,
              title: this.refs.title.value,
            } )
          )
     }
     _handle_DeleteChange = ( evt ) => {
         this.context.relay.commitUpdate(
             new hobbyDeleteMutation( {
               hobby: this.props.hobby,
               Viewer: this.props.Viewer
             } )
           )
      }
}

export default Relay.createContainer(HobbyItem, {
  fragments: {
    hobby: () => Relay.QL`
      fragment on Hobby {
          id,
          title,
          ${hobbyUpdateMutation.getFragment('hobby')},
          ${hobbyDeleteMutation.getFragment('hobby')},
      },
    `,
    Viewer: () => Relay.QL`
      fragment on Viewer {
          ${hobbyDeleteMutation.getFragment('Viewer')},
        },
    `,
  },
});
