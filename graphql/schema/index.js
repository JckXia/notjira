const { buildSchema } = require("graphql");

//TODO Learn enum type to set task State
module.exports = buildSchema(`

type BranchRef{
  sha:String
  url:String
  branchName:String!
}

type Branch{
  headBranchDataInfo:BranchRef!
  baseBranchDataInfo:BranchRef!
 
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
 repo_html_url:String!
 date_created:String!
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

input BranchCreationInput{
  taskId:String!
  parentRefHash:String!
  parentBranchName:String!
  repoName:String!
  taskName:String!
}

input PullRequestCreationInput{
  repoOwner:String!
  repoName:String!
  title:String!
  headBranchName:String!
  baseBranchName:String!
  taskId:String!
}
 
type RootMutation{
  createRepo(repoName:String!):Repo!
  createTask(newTaskName:String!,repoName:String!):TaskItem!
  updateTaskStatus(taskId:ID!,repoName:String!,taskState:String!):TaskItem!
  deleteTask(taskId:ID!,repoName:String!):TaskItem!
  deleteRepo(repoName:String!):ResponsePayload!
  createBranch(branchCreationInput:BranchCreationInput!): Branch!
  deleteBranch(repoName:String!,repoOwner:String!,branchName:String!,taskId:String!):Branch!
  createPullRequest(pullRequestCreationInput:PullRequestCreationInput!):PullRequest!
}

  schema{
    query:RootQuery
    mutation:RootMutation
  }
`);
