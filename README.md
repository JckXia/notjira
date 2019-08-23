NotJIRA

* Functionalities:
	* 1. Ability to create/delete repositories 
	* 2. Add/remove users as collaborators. 
	* 3. Any changes made from github's site is to be synced over with the use of webhooks 
	* 4. Ability to create/ delete branches for a repository 
	* 5. Ability to create and delete pull requests 
	* 6. Changes made to the pull requests are to be synced with the use of webhooks 
	* 7. All deployments is to be done to heroku for now. (May move to AWS in the future) 

* Completed:
	* 1. Create / delete repoistory with a call to the API 
	* 2. Authentication
	* 3. Deployed current app to cloud 

* Checklists:	
	* 1. Modify database schema
	* 2. Create mechanism for responding to webhook responses 
	* 3. Add pull request creation and deletion to application 
	* 4. Handle pull request merges and sees feed back for PR 
	* 5. Deploy with heroku along the way 
* Contribute:	
	* 1. To install the application, run npm install at the root folder 
	* 2. Setup github client id and secret keys
	* 3. Make sure mongodb is running on local
	* 4. Make a PR! :)
