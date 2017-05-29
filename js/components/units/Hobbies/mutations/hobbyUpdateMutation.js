/* @flow weak */

import Relay from 'react-relay'


export default class hobbyUpdateMutation extends Relay.Mutation {
  static fragments = {
    hobby: () => Relay.QL `
      fragment on Hobby {
        id,
      }
    `,
  }
  getMutation() {
    return Relay.QL `mutation{updateHobby}`
  }
  getFatQuery() {
    return Relay.QL `
      fragment on UpdateHobbyPayload {
        hobby {
            title
        },
      }
    `
  }
  getConfigs() {
      return [{
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          hobby: this.props.hobby.id,
        },
    }];
  }
  getVariables() {
    return {
      id: this.props.hobby.id,
      title: this.props.title,
    }
  }
  getOptimisticResponse() {
    return {
      hobby: {
        id: this.props.hobby.id,
        title: this.props.title,
      },
    }
  }
}
