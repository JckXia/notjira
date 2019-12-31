const { buildSchema } = require("graphql");

//TODO Add TaskItem type
module.exports = buildSchema(`

type PullRequest{
  pullRequestTitle:String!
  pullRequestUrl:String!
}

type TaskItem{
  _id:ID!
  task_state:String!
  taskName:String!
  taskDesc:String!
  pullRequestList:[PullRequest!]
}

type Repo{
 _id:ID!
 repo_name:String!
 repo_admin_pk:String!
 repo_admin_userName:String!
 repo_admin_name:String!
 repo_creator_name:String!
 repo_creator_pk:String!
 task_items:[TaskItem!]
}

type User{
 _id:String!
 repoLists:[Repo!]
 gitHubId:String!
 userName:String!
}

type RootQuery{
   userInfo:User!
  singleRepo(repoId:ID!):Repo!
   testGet:String!
}  

type ResponsePayload{
  status:Int!
  message:String
}

type RootMutation{
  createRepo(repoName:String!):Repo!
  deleteRepo(repoName:String!):ResponsePayload
}

  schema{
    query:RootQuery
    mutation:RootMutation
  }
`);
