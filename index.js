const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`
    type Movie {
        title: String
        actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
    }

    type Actor {
        name: String
        movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }
`;

// instance of neo4j graphql
const driver = neo4j.driver(
    "bolt://198.19.143.26:7687",
    neo4j.auth.basic("neo4j","password")
)

const neo4jSchema = new Neo4jGraphQL({ typeDefs, driver })

// instance of apolloserver
neo4jSchema.getSchema().then(schema => {
    const server = new ApolloServer({
        schema
    })

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    })
})