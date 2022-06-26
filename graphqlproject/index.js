const express = require('express')

const { graphqlHTTP } = require('express-graphql');

const app = express()

const PORT = 8085

const {
    GraphQLList
  } = require('graphql')

  const {
    GraphQLSchema
  } = require('graphql')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull
  } = require('graphql')

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'This represents a movie made by an Actor',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      actorId: { type: GraphQLNonNull(GraphQLInt) },
    })
  })

  const ActorType = new GraphQLObjectType({
    name: 'Actor',
    description: 'This represents actor of a movie',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      movies: {
        type: new GraphQLList(MovieType),
        description: 'List of All Movies',
        resolve: () => Movies
      },
      actors: {
        type: new GraphQLList(ActorType),
        description: 'List of All Actors',
        resolve: () => Actors
      },
      movie: {
        type: MovieType,
        description: 'A Movie',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => Movies.find(movie => movie.id === args.id)
      },
      actor: {
        type: ActorType,
        description: 'An Actor',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => Actors.find(actor => actor.id === args.id)
      }
    })
  })


  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addMovie: {
        type: MovieType,
        description: 'Add a movie',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          actorId: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: (parent, args) => {
          const movie = { id: Movies.length + 1, name: args.name,actorId:args.actorId }
          Movies.push(movie)
          return movie
        }
      },
      removeMovie: {
          type: MovieType,
          description: 'Remove a Movie',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: (parent, args) => {
              Movies = Movies.filter(movie => movie.id !== args.id)
              return Movies[args.id]
          }
        },
      addActor: {
        type: ActorType,
        description: 'Add an Actor',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: (parent, args) => {
          const actor = { id: Actors.length + 1, name: args.name }
          Actors.push(actor)
          return actor
        }
      },
      removeActor: {
          type: ActorType,
          description: 'Remove an Actor',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: (parent, args) => {
              Actors = Actors.filter(actor => actor.id !== args.id)
              return Actors[args.id]
          }
        },
        updateActor: {
          type: ActorType,
          description: 'Update an Actor',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name:{type:new GraphQLNonNull(GraphQLString)}
          },
          resolve: (parent, args) => {
              Actors[args.id - 1].name = args.name
              return Actors[args.id - 1]
          }
        },
        updateMovie: {
          type: MovieType,
          description: 'Update a Movie',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name:{type:new GraphQLNonNull(GraphQLString)},
            actorId:{type:new GraphQLNonNull(GraphQLInt)}
          },
          resolve: (parent, args) => {
              Movies[args.id - 1].name = args.name
              Movies[args.id - 1].actorId = args.actorId
              return Movies[args.id - 1]
          }
        },
    })
  })

  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

var Actors = [
    { id: 1, name: 'Tom Cruise' },
    { id: 2, name: 'Leonardo DiCaprio' },
    { id: 3, name: 'Will Smith' }
]

var Movies = [
    { id: 1, name: 'Top Gun', actorId: 1 },
    { id: 2, name: 'Inception', actorId: 2 },
    { id: 3, name: 'I Am Legend', actorId: 3 },
    { id: 4, name: 'Mission Impossible', actorId: 1 },
    { id: 5, name: 'The Revenant', actorId: 2 },
    { id: 6, name: 'Focus', actorId: 3 },
    { id: 7, name: 'Edge of Tomorrow', actorId: 1 },
    { id: 8, name: 'Blood Diamond', actorId: 2 }
]


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema:schema
  }))

  app.listen(8088, () => console.log('server running'));