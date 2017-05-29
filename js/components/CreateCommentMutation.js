import Relay from 'react-relay'

export default class CreateCommentMutation extends Relay.Mutation {
  static fragments = {
    story: () => Relay.QL`
      fragment on Story { id }
    `,
  };
  getMutation() {
    return Relay.QL`
      mutation{ createComment }
    `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateCommentPayload {
        story { comments },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { story: this.props.story.id },
    }];
  }
  getVariables() {
    return {
      name: this.props.name,
      comments: this.props.comments
    };
  }
}
