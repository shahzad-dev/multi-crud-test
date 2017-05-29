/* @flow weak */

import Relay from 'react-relay'


export default class hobbyAddMutation extends Relay.Mutation {
  static fragments = {
    Viewer: () => Relay.QL `
      fragment on Viewer {
        id,
      }
    `,
  }
  getMutation() {
    return Relay.QL `mutation{insertHobby}`
  }
  getFatQuery() {
    return Relay.QL `
      fragment on InsertHobbyPayload {
        hobby,
        Viewer {
            hobbies
        },
      }
    `
  }
  getConfigs() {
    return [ {
      type: 'RANGE_ADD',
      parentName: 'Viewer',
      parentID: this.props.Viewer.id,
      connectionName: 'HobbyConnection',
      edgeName: 'hobby',
      rangeBehaviors: {
      },
    } ]
  }
  getVariables() {
    return {
      title: this.props.title,
    }
  }
  getOptimisticResponse() {
    return {
      // FIXME: ToDo_TotalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      hobby: {
        node: {
          id: this.props.id,
        },
      },
      Viewer: {
        id: this.props.Viewer.id,
      },
    }
  }
}
