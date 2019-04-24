Backend restructure

TODO:

1. Create a file in config file , importing GitHub personal access token
2. Create the following managers
    1. getProjectAdmin(projectName)
    2. getProjectCollaborators(projectName)
    3. findUserGivenId(UserId)
    4. findUserGivenName(UserName)
    5. getProjectBranches(project)
    6. getProjectTasks(projectName)
    7. getProjectPullRequests(projectName)
3. Implement the following api routes
All below are  to be done using a personal access token


1. Create branch.     /github/:repoName/:taskId/create_branch
 	
  	in body
  	Data required: she key of the branch we are branching from 
				Name of the newly created branch

        API restrictions: Authenticated users.
			          Project admin  or
				 Project assignee


2. Create pull requests  /github/:repoName/:taskId/create_pull

	Data required: The sha references of the branch we are attempting to make a PR for 
	
	API restrictions: Authenticated users 
				  Project adminor
				 Project participants (NOTE, project participants in this instance ==project collaborator)
 

3. Create repo.     /github/create_repo

	Data required: Name 


4. Delete repo   /github/:repoName
  	
	Data required:name/pk

	API restrictions: Authenticated user
			          Project creator	


4.Add a model called tasks  (TODO. In the backlog)
  	Task:{
	 taskName:’Finding replacement for lodash’;
	branch:’PLAT-7641’
  	subTasks:’[]’; //This is a recursive structure
	hasPrOpen:true
	}	

Task associated API calls:
	
      1. Create a task  /task/:projectRepo/:cardId/create_task


      2. Create a branch for this task.  /task/:projectId/
 	

5.Revise the card API. (For simplicity sake, we will go with this option)
	-New card data schema:
	Card:{
       	taskName:’taskingThis’,
	//TODO:refactor the branch into its own model
 	branch:’PLAT-41231-solveTaskingthis’
	hasPrOpen:true
	}

New Card API calls:
	
	1.Create card.  POST   /card/:projectName/create_card

	2, Delete card  DELETE /card/project/:projectName/card/:cardId/delete_card

	3. Create branch for card /card/projec:projectName/card/:cardId/create_branch

	
1.  
		

Work flow:

User click login

User directed to SSO page

User logs in 

User on landing page, displaying the number of repos they have created (GET all projects of a given user)

User clicks on a project, react  router redirects to project page (GET call, returning information in that repo)

User clicks on 	create card, modal pops up, display the field for inputting the name of the card.

Once card has been created, it is of Todo state. 

A button called create branch is shown if you click on the card again

Click on the button redirects to a new page. 

On the new page, we will see an input box.

The input box will be profiled with {randNum}-{NameOfBranchToBeCreated}

Any edit to it is allowed 

Another drop down will display the available branches in that repository

 A click to create button, will send a request to the create_branch API. This API will take the sha key of the reference as well as the name of the new branch to be created

Once request Is finished, we navigate back to the project page for other tasks.

By click on create branch, we have also changed the state of the library card. setState is called and its new state is written into a database


 




