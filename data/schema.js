import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql';
import {
  mutationWithClientMutationId,
} from 'graphql-relay';

var Datastore = require('@google-cloud/datastore');

const ds = Datastore({
  projectId: 'nodeProj'
});

var key = ds.key(['Product', 'Computer']);

ds.get(key, function(err, entity) {
  console.log(err || entity);
});

const STORY = {
  comments: [],
  id: '42',
};

const kind = 'Story';

function DataCreate(entity, cb) {
    /*var size = entities;
    ds.upsert(entities)
      .then(() => {
        // Tasks inserted successfully.
        console.log("Added to ds");
    });*/
    ds.save(
        entity,
        (err) => {
          data.id = entity.key.id;
          cb(err, err ? null : data);
        }
      );
}

function fromDatastore (obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

function DataRead(id, cb) {
    const key = ds.key([kind, parseInt(id, 10)]);
    ds.get(key, (err, entity) => {
      if (err) {
        cb(err);
        return;
      }
      if (!entity) {
        cb({
          code: 404,
          message: 'Not found'
        });
        return;
      }
      cb(null, fromDatastore(entity));
    });
}

function getStory() {
    DataRead("5639445604728832", (err, entity) => {
        if (err) {
            console.log("Get Story Error", err);
          return;
        }

        return entity;
    });
}

function getKey() {
    return ds.key(kind, "5639445604728832", 'Comments');
}

function insertComment(entity) {
    DataCreate(entity, (err, savedData) => {
        if (err) {
          //next(err);
          console.log("Insert Comment Error", err);
          return;
        }
        console.log("Successfully added", savedData);
      });
       //entities[size-1];
}

var CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: {type: GraphQLID},
    text: {type: GraphQLString},
  }),
});

var CommentInputType = new GraphQLInputObjectType({
  name: 'CommentInput',
  fields: () => ({
    text: {
      type: GraphQLString
    },
  })
});

var StoryType = new GraphQLObjectType({
  name: 'Story',
  fields: () => ({
    comments: { type: new GraphQLList(CommentType) },
    id: { type: GraphQLString },
  }),
});

var CreateCommentMutation = mutationWithClientMutationId({
  name: 'CreateComment',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString)},
    comments: { type: new GraphQLList(CommentInputType) },
  },
  outputFields: {
    story: {
      type: StoryType,
      resolve: () => getStory(),
    },
  },
  mutateAndGetPayload: ({name, comments}) => {
    var newComment = {};
    comments.map(comment => {
      newComment = {
        id: getKey(),
        text: comment.text
      };
      //STORY.comments.push(newComment);
      insertComment(newComment)
    });

    return newComment;
  },
});

export var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      story: {
        type: StoryType,
        resolve: () => getStory(),
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      createComment: CreateCommentMutation,
    }),
  }),
});
