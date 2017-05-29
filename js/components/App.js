import React from 'react';
import Relay from 'react-relay';
import CreateCommentMutation from './CreateCommentMutation';

class Comment extends React.Component {
  render() {
    var {id, text} = this.props.comment;
    return <li key={id}>{text}</li>;
  }
}
Comment = Relay.createContainer(Comment, {
  fragments: {
    comment: () => Relay.QL`
      fragment on Comment {
        id,
        text,
      }
    `,
  },
});

class App extends React.Component {

    _handleSubmit = (e) => {
      e.preventDefault();
      console.log(this.refs.newCommentInput1.value);
      console.log(this.refs.newCommentInput2.value);
      Relay.Store.commitUpdate(
        new CreateCommentMutation({
          story: this.props.story,
          name: "Blah",
          comments: [
              {text: this.refs.newCommentInput1.value},
              {text: this.refs.newCommentInput2.value}
          ]
        })
      );
      this.refs.newCommentInput1.value = '';
      this.refs.newCommentInput2.value = '';
    }
    render() {
      var {comments} = this.props.story;
      return (
        <form onSubmit={this._handleSubmit}>
          <h1>Breaking News</h1>
          <p>The peanut is neither a pea nor a nut.</p>
          <strong>Discuss:</strong>
          <ul>
            {comments.map(
              (comment, index) => <Comment key={index} comment={comment} />
            )}
          </ul>
          <input
            key={1}
            placeholder="Weigh in&hellip;"
            ref="newCommentInput1"
            type="text"
          /><br/><br/>
         <input
            key={2}
            placeholder="Weigh in&hellip;"
            ref="newCommentInput2"
            type="text"
          /><br/><br/>
        <input type="submit" value="Submit" />
        </form>
      );
    }
}

export default Relay.createContainer(App, {
    fragments: {
      story: () => Relay.QL`
        fragment on Story {
          comments {
            ${Comment.getFragment('comment')},
          },
          ${CreateCommentMutation.getFragment('story')},
        }
      `,
    },
});
