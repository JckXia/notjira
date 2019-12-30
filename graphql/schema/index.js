const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Repo{
 _id:ID!
 name:String!
 webhookurl:String!
 repo_html_url:String!
 date_created:String!
 repo_creator:String!
}

type User{
 _id:String!
 repoLists:[Repo!]
 gitHubId:String!
 userName:String!
}

type RootQuery{
      userInfo:User!
      repos:[Repo!]!
      singleRepo:Repo!
      testGet:String!
  }  
  schema{
      query:RootQuery
  }
`);
