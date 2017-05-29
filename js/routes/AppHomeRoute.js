import Relay from 'react-relay';

export default class extends Relay.Route {
    static queries = {
      story: (Component) => Relay.QL`
        query StoryQuery {
          story { ${Component.getFragment('story')} },
        }
      `,
    };
  static routeName = 'AppHomeRoute';
}
