async function sendQueryToGraphQl(query) {
  const requestResult = await fetch("/graphql", {
    method: "POST",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return requestResult.json();
}

const graphQLHelperFunction = {
  getUserInfo: async () => {
    const reqBody = {
      query: `query{
      userInfo {
        _id
        userName
        gitHubId
        repoLists{
            _id
          repo_name
          repo_creator_name
          repo_html_url
          date_created
        }
      }
    }
     `
    };
    return sendQueryToGraphQl(reqBody);
  },
  createGitHubRepository: async repoName => {
    const reqBody = {
      query: `mutation createRepositories($repoName:String!){
        createRepo(repoName: $repoName) {  
          repo_name
        }
      }
      `,
      variables: {
        repoName: repoName
      }
    };

    return sendQueryToGraphQl(reqBody);
  },
  deleteGitHubRepository: async repoName => {
    const reqBody = {
      query: `
      mutation deleteRepo($repoName:String!) {
        deleteRepo(repoName: $repoName) {
          status
        }
      }
      `,
      variables: {
        repoName: repoName
      }
    };
    return sendQueryToGraphQl(reqBody);
  },
  createTask: async (newTaskName, repoName, newTaskDescription) => {
    const reqBody = {
      query: `
        mutation createTask($newTaskName:String!,$repoName:String!,$taskDescription:String) {
        createTask(newTaskName: $newTaskName, repoName: $repoName,taskDescription:$taskDescription) {
          _id
          taskName
        }
      }
      
      `,
      variables: {
        newTaskName: newTaskName,
        repoName: repoName,
        taskDescription: newTaskDescription
      }
    };
    return sendQueryToGraphQl(reqBody);
  },
  deleteTask: async (taskId, repoName) => {
    const reqBody = {
      query: `
      mutation deleteTask($taskId:ID!,$repoName:String!){
         deleteTask(taskId:$taskId,repoName:$repoName){
            taskName
         }
      }
      `,
      variables: {
        taskId: taskId,
        repoName: repoName
      }
    };
    return sendQueryToGraphQl(reqBody);
  },
  updateTask: async (taskId, repoName, taskState) => {
    const reqBody = {
      query: `
      mutation updateStatus($taskId:ID!,$repoName:String!,$taskState:String!){
      updateTaskStatus(taskId: $taskId, repoName: $repoName, taskState: $taskState) {
        taskName
      }
    }
      `,
      variables: {
        taskId: taskId,
        repoName: repoName,
        taskState: taskState
      }
    };
    return sendQueryToGraphQl(reqBody);
  }
};
export default graphQLHelperFunction;
