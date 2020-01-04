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
  }
};
export default graphQLHelperFunction;
