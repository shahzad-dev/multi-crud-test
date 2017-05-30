/*eslint-env es_modules */
/*eslint-disable no-unused-vars */
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
  projectId: 'nodeproj-168001',
  apiEndpoint: 'http://localhost:8081'
});

/*var key = ds.key(['Product', 'Computer']);

ds.get(key, function(err, entity) {
  console.log(err || entity);
});
*/
const STORY = {
  comments: [],
  id: '42',
};

const kind = 'Story';

function fromDatastore (obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

function DataList(kind, cb) {
    var query = ds.createQuery(kind);
    ds.runQuery(query)
      .then((results) => {
        // Task entities found.
        //console.log("Query Results", results);
        const entities = results[0];

        /*console.log('Comments:');
        list.forEach((item) => {
            var id = item[Datastore.KEY].id;
            console.log("ID", id);
            console.log("Item", item)
        });*/

        cb( entities.map(fromDatastore) );
        //console.log("Story", STORY);
      });
}

/*DataList(10, req.query.pageToken, (err, entities, cursor) => {
    res.render('books/list.jade', {
      books: entities,
      nextPageToken: cursor
    });
  });
*/

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
          cb(err, err ? null : entity);
        }
      );
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

function getStory(data) {
   /* DataRead("5639445604728832", (err, entity) => {
        if (err) {
            console.log("Get Story Error", err);
          return;
        }

        return entity;
    })*/

    //console.log("Execute Query");
   //STORY.comments = data;

   return STORY;
}

function getKey() {
    return ds.key('Comments'); //kind, "5639445604728832",
}

function toDatastore (obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}

function insertComment(data) {
	var commentData = {
	  user: "spiderman",
	  text: data.text,
	};
	var entity = {
		key: getKey(),
		data: commentData
	};
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
    user: {type: GraphQLString},
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
      resolve: () => DataList("Comments", getStory),
    },
  },
  mutateAndGetPayload: ({comments}) => {
    var newComment = {};
    comments.map(comment => {
      newComment = {
        id: getKey(),
        text: comment.text
      };
      //STORY.comments.push(newComment);
      insertComment(newComment);
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
        resolve: () => DataList("Comments", getStory),
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
