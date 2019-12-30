const { buildSchema } = require("graphql");

//TODO Add TaskItem type
module.exports = buildSchema(`

type TaskItem{
  _id:ID!
  task_state:String!
  taskName:String!
  taskDesc:String!
}

type Repo{
 _id:ID!
 repo_name:String!
 repo_admin_pk:String!
 repo_admin_userName:String!
 repo_admin_name:String!
 repo_creator_name:String!
 repo_creator_pk:String!
 
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
