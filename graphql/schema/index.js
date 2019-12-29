const { buildSchema } = require("graphql");

module.exports = buildSchema(`

  type RootQuery{
      testGet:String!
  }  
  schema{
      query:RootQuery
  }
`);
