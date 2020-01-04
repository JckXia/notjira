async function sendQueryToGraphQl(query) {
  const reqBody = {
    query: `${query}`
  };
  const requestResult = await fetch("/graphql", {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return requestResult.json();
}

const graphQLHelperFunction = {
  getUserInfo: async () => {
    const query = `query{
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
     `;
    return sendQueryToGraphQl(query);
  }
};
export default graphQLHelperFunction;
