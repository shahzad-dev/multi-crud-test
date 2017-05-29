import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    Viewer: () => Relay.QL`
      query {
        Viewer
      }
    `,
    store: (Component) => Relay.QL`
        query storeQuery {
          store { ${Component.getFragment('store')} },
        }
    `
  };
  static routeName = 'AppHomeRoute';
}
