/* @flow weak */

import Relay from 'react-relay'


export default class hobbyDeleteMutation extends Relay.Mutation {
  static fragments = {
    hobby: () => Relay.QL `
      fragment on Hobby {
        id,
      }
    `,
    Viewer: () => Relay.QL `
      fragment on Viewer {
        id,
      }
    `,
  }
  getMutation() {
    return Relay.QL `mutation{deleteHobby}`
  }
  getFatQuery() {
    return Relay.QL `
      fragment on DeleteHobbyPayload {
        deletedHobbyId,
        Viewer {
            id
        },
      }
    `
  }
  getConfigs() {
    return [ {
      type: 'NODE_DELETE',
      parentName: 'Viewer',
      parentID: this.props.Viewer.id,
      connectionName: 'HobbyConnection',
      deletedIDFieldName: 'deletedHobbyId',
    } ]
  }
  getVariables() {
    return {
      id: this.props.hobby.id,
    }
  }
  getOptimisticResponse() {
    return {
      deletedHobbyId: this.props.hobby.id,
    }
  }
}
