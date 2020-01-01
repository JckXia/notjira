const { buildSchema } = require("graphql");

//TODO Learn enum type to set task State
module.exports = buildSchema(`

type BranchRef{
  sha:String!
  type:String!
  url:String!
}

type Branch{
  branchRefData:BranchRef!
  refName:String!
  parentRefData:String!
  parentBranchName:String!
}

type PullRequest{
  pullRequestTitle:String!
  pullRequestUrl:String!
}

type TaskItem{
  _id:ID!
  task_state:String!
  taskName:String!
  taskDesc:String!
  branchList:[Branch!]
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
  createTask(newTaskName:String!,repoName:String!):TaskItem!
  updateTaskStatus(taskId:ID!,repoName:String!,taskState:String!):TaskItem!
  deleteTask(taskId:ID!,repoName:String!):TaskItem!
  deleteRepo(repoName:String!):ResponsePayload!
}

  schema{
    query:RootQuery
    mutation:RootMutation
  }
`);
