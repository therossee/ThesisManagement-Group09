# End 2 End Testing
This file contains the information related to the end 2 end testing of the project. Basically, it contains reference to each detailed test case with some more information.

---

## Requirements
Before each test case, you need to:
- Install all the required tools to run the project
- Reset the database in order to only have the test data
- Start the project (frontend and backend)

---

## Test Cases
### [1] Virtual Clock management
This test case is related to the virtual clock management. During this test case, we will check that the virtual clock
is correctly updated and impact correctly the output of the system.

1. Go to the [home page](http://localhost:5173/)
2. Login as a teacher
3. Click on the menu button "Administration"
     - You should access the [virtual clock administration page](http://localhost:5173/admin/virtual-clock)
     - The clock should be set to the current time in your timezone
4. Click on the edit button
     - The clock shown on the input should be set to the current time in your timezone
5. Click on the bar when is shown the date and the time -> you can now modify them -> choose another date and a new time
6. Save the changes by clicking on the "SAVE NEW CLOCK" button
    - You should see the same page as step 3 but with the new clock you indicated and the information of exactly how much ahead the clock is
7. You can edit it again by clicking on 'Edit' button aviable -> click on it
8. If you changed your mind, you can click on the button "Cancel" and leave it as it is

-> Each time you update the clock you can use the search thesis proposal page to check if the status of a proposal is
accordingly updated

### [2] Thesis Proposal filtering
This test case is related to the filtering of the thesis proposal by the student. During this test case, we will check that the filtering is correctly done and that the student can see the correct proposals.

1. Go to the [home page](http://localhost:5173/)
2. Log in as a student (warning, the result of the test case will be different depending on the degree of the student)
    - You should see a new option on the left bar menu
3. Click on the menu button "Thesis Proposals"
    - You should access the page to [search thesis proposals](http://localhost:5173/proposals)
4. Play randomly with filters and ordering
    - You should see the list of thesis proposals updated accordingly to the filters and ordering
    - If you want to change the list of thesis, you can sign as a student of another degree

### [3] Thesis Proposal creation
This test case is related to the creation of a thesis proposal by the teacher. During this test case, we will check that the creation is correctly done and that the proposal is correctly created

1. Go to the [home page](http://localhost:5173/)
2. Log in as a teacher
    - You should see a new icon on the top bar menu 
3. Click on the top bar menu new icon
   - You should access the page to [create a new thesis proposal](http://localhost:5173/insert-proposal)
4. Insert all the fields (the ones marked with a red '*' are mandatory), try to not insert all of them and Submit and an error will be displayed
5. Scroll till the end of the page and click on 'Submit'
    - then an overview of what you inserted will appear -> Review the proposal to be sure is how you wanted it
6. Again scroll till the end of the page and confirm the insertion of the thesis proposal by clicking on 'Next' button
7. A message will be displayed of the correct insertion of the proposal and a button to [home page](http://localhost:5173/) will be present
9. Click on that button
8. Log out


### [4] Security of pages
This test case is related to the security of the pages. During this test case, we will check that the security is correctly done and that the user can access to the correct pages while the other pages are not accessible.

1. Go to the [home page](http://localhost:5173/)
2. Try to access the [list thesis proposal page](http://localhost:5173/proposals)
   - You should see a page indicating that you are not authorized to access this page
3. Log in as a student using the form at the top of the page
   - Once logged in, the page should be refreshed, and you should see the list of thesis proposals
4. Log out using the form at the top of the page
   - Once logged out, the page should be refreshed, and you should see the page indicating that you are not authorized
     to access this page
5. Log in as a teacher
   - Once logged in, the page should be refreshed, but you should still see the page indicating that you are not
     authorized to access this page
6. Try to access the page to [create a new thesis](http://localhost:5173/insert-proposal)
   - You should see the form
7. Log out
   - Once logged out, the page should be refreshed, and you should see the page indicating that you are not authorized to access this page

### [5] Search for proposal
This test case is related to the possibility to search, as a student, the thesis proposals matching with his/her interests.

1. Go to the [home page](http://localhost:5173/)
2. Login as a student that has not applied for any proposal
3. Click on 'Thesis Proposal' in the left tab and go to [proposals page](http://localhost:5173/proposals)
4. Click on the button near to 'Title'
   - It should appear a tab where to do a search
5. Write some text of your interest that can be contained in the title
6. Click on the button "Search"
7. Browse the proposals resulting from the search
8. Click again on the button near 'Title'
9. Click 'Reset' and 'Search' again to see all the proposals again
10. Click on the button near 'Keyword'
11. Browse the keywords and select those of your interest
12. You can also search a keyword writing in the search tab placed on the top of the keywords
13. Try to write an incomplete word and with opposite lower/upper case (for example 'SPACE' instead of 'aerospace') to see that the search is not case sensitive and is "smart"
14. Once you selected all the keywords click on 'OK' to see the matches
15. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [6] Apply for proposal
This test case is related to the application of a student to a proposal.

1. Go to the [home page](http://localhost:5173/)
2. Log in as a student
3. On the left bar click on 'Application History'
4. Check that there are no applications or only rejected applications
5. Click on 'Thesis Proposal' in the left tab and go to [proposals page](http://localhost:5173/proposals)
6. On the last column ('Actions') there is the icon of an eye, click on it and you will be in the thesis proposal page like in this [example](http://localhost:5173/view-proposal/2)
7. Scroll till the end of the page
8. On the button left corner there will be a button 'Apply for proposal', it will be clickable only if the student have not applied to any proposals
9. Click on it
10. On the left bar click on 'Application History' 
11. Check if the proposal you applied for is present as 'waiting for approval'
      - you have succesfully applied for a thesis proposal
13. Click on 'Thesis Proposal' on the left bar and go to [thesis proposals page](http://localhost:5173/proposals)
14. Try to apply for another proposal
      - You should see that this possibility is disabled
15. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [7] Browse and accept/reject applications
This test case is related to the possibility of seeing all the applications for eache thesis proposal from the side of a professor, so that he/she can accept or reject them.

1. Go to the [home page](http://localhost:5173/)
2. Login as a teacher that has a proposal with at least 2 applicants
3. Click on 'Thesis Application' on the left bar and go to [Thesis applications page](http://localhost:5173/applications)
4. You can see the students that applied for the proposals
      - click on ✘ near the name of a student -> the application for that student will be rejected
      - click on ✔ and accept one student -> you will see a confirmaton message that you accepted a student
5. Click on 'Thesis Proposals' on the left bar and go on [Thesis proposal page](http://localhost:5173/proposals)
      - you will see that the accepted proposal is not there anymore
6. Log out
    - You should be again on the [home page](http://localhost:5173/)



### [8] Browse application decisions
This test case is related to the verification that each student can see the history of their applications and the decision for each of them.

1. Go to the [home page](http://localhost:5173/)
2. Login as a student
3. Click on "Applications History" placed in the left bar, under "Thesis Proposals" [Application History](http://localhost:5173/applications)
4. Ensure that the history of applications is correctly viewed
5. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [9] Browse Proposals
This test case is related to the verification that each teacher can view the list of active thesis proposals.

1. Go to the [home page](http://localhost:5173/)
2. Login as a teacher
3. Click on "Thesis Applications" placed in the left bar, under "Thesis Proposals" [Thesis Applications](http://localhost:5173/applications)
4. Ensure that the active thesis proposals are listed there 
5. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [10] Update Proposal
This test case is related to the update of a proposal from teacher's point of view. 

1. Go to the [home page](http://localhost:5173/)
2. Login as a teacher
3. Click on "Thesis Proposals" in the left bar [Thesis Proposals](http://localhost:5173/proposals)
4. Choose a thesis you want to update and see the icon in the middle in the last column (actions). When you move the mouse cursor over it, you'll see the phrase 'edit proposal'. Click on it.
5. You are now in [edit proposal page](http://localhost:5173/edit-proposal/1). The view is similar to the one of insert proposal, with the exception that each field is already filled. You can modify whatever you want. Once you finish, click on 'submit' at the end of the page. 
6. You can see now a page with the of the draft of the edited proposal. You can review it, if other changes are needed or you make a mistake you can click on 'Previous' button at the end of the page. Otherwise you can click on 'Next' button. 
7. You are now in a page that confirms you that the changes are made correctly. There is a button 'Back Home' to close it. Click on it.
8. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [11] Notify Application Decision
This test case is related to the student's point of view: we want to verify that notificaiton system which informs the student if when his/her application is accepted works correctly.

1. Go to the [home page](http://localhost:5173/)
2. Log in as a teacher
3. Click on 'Thesis Applications' in the left bar. You are now in [Thesis Applicaitons page](http://localhost:5173/applications) and you can see all the applications for the thesis
4. Accept one of them/reject one of them
5. Go to the student's private mail and check if the notification mail is arrived
6. After seeing that everything was as espected come back to [Thesis Applications page](http://localhost:5173/applications)
7. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [12] Archive Proposal
This test case is related to the possibility for the teacher to archive a Thesis Proposal.

1. Go to the [home page](http://localhost:5173/)
2. Log in as a teacher
3. Click on 'Thesis Proposal'. You are now in [Thesis Proposal page](http://localhost:5173/proposals) and you can see the thesis proposals you created
4. On the 'Action' column click on the last button ('Archive proposal')
5. A small window will open and you'll read "Are you sure you want to archive this proposal?" -> click on 'yes'
6. A pop-up message will be displayed to inform you that the proposal has been archived succesfully
7. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [13] Access applicant cv and see the uploaded pdf file
This test case is related to the possibility to see the appliant's cv (list of exams).

1. Go to the [home page](http://localhost:5173/)
2. Log in as a teacher
3. Click on 'Thesis Applications' in the left bar. You are now in [Thesis Applicaitons page](http://localhost:5173/applications) and you can see all the applications for the thesis
4. Under the upper bar (top of the page) you'll see the instructions to see the cv of a student: "To view a specific applicant's CV and eventually the file uploaded within the application, simply click anywhere in the corresponding row." -> click on a row of a student
5. The cv will be visible on the right part of the page, with all th relevant informations of the student (name, surname, id) and the list of all the marks of the exams obtained. On the top of this page there is a button "View attached pdf" (it is enabled only if the student attached a pdf file) -> click on it
6. You should see the pdf file
7. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [14] Copy proposal
This test case is related to copy a proposal: we want to create a new thesis proposal with some common fields of an existing one.

1. Go to the [home page](http://localhost:5173/)
2. Log in as a teacher
3. Click on ['Thesis Proposal'](http://localhost:5173/proposals) in the left bar
4. Choose a proposal to copy and click on the button in the middle of 'Actions' column for it (icon of a file)
5. It will appear the format of the insertion of a proposal with all the fields completed (as the Proposal we want to copy)
6. Do the modifications you prefer
7. Click on 'Submit' at the end of the page
8. You are now on a page "review proposal" -> check the changes you made are correct
9. Click on 'Next' button at the end of the page -> you should be informed that the proposal is now uploaded successfully
10. Click on 'Back Home' button
11. Click on ['Thesis Proposal'](http://localhost:5173/proposals) again and check your proposal is correctly shown
12. Log out
    - You should be again on the [home page](http://localhost:5173/)

### [15] Insert Student Start Request - Secretary/Professor Approval
This test case validates the possibility for a student to insert a thesis start request and as it is useful to show the approval by a secretary clerk and a professor we will show and test also this features 

1. Go to the [home page](http://localhost:5173/)
2. Log in as a student who has not still made a student start request (for example the one with id s318771)
3. In the left bar click on [Thesis Start Request](http://localhost:5173/start-request)
4. Click on the button 'Add New Thesis Start Request'
5. Complete all the necessary fields
6. Click on 'Submit' -> in the [Thesis Start Request](http://localhost:5173/start-request) page you will now see all the details of your thesis start request and in particular the status is _1/3 - Waiting for approval from the secretary_. Please look and memorise the professor you choose as Supervisor (necessary for the next step).
7. Log out
8. Log in as the teacher you choose as Supervisor -> in the [Thesis Start Request](http://localhost:5173/start-request) section you won't see the thesis start request, because it is mandatory that the start request is firstly approved by a secretary clerk.
9. Log out 
10. Now log in as a secretary clerk (id: abbondanzio.rossi@polito.it, password: sc12345)
11. In the left bar click on [Thesis Start Request](http://localhost:5173/start-request)
12. Scroll the opened thesis start request. Please, note that it is clearly represented that is 'waiting for approval' -> click con 'Accept' -> then confirm action ('Yes, accept the start request') -> note that is now marked as 'accepted by secretary'
13. Let's try to reject a thesis start request to see this other functionality. Choose another thesis start request and click on 'Reject' -> then on 'Yes, reject the start request'-> you can see that the thesis start request is marked as 'rejected by secretary'
14. Let's open another tab (maybe in private mode or the opposite if already in private mode) to check that the student is informed about the rejection
    1. Go to the [home page](http://localhost:5173/)
    2. Log in as the student whose application has been rejected
    3. Go on [Thesis Start Request](http://localhost:5173/start-request) -> you will see that the status is '1/3 - Rejected by the secretary, you can submit a new one'
    4. Let's try if it is possible to start a new thesis start request -> click on the button 'Add New Thesis Start Request' and do the procedure explained before
    5. Log out 
    6. Log in as the supervisor teacher of the rejected application
    7. Go in [Thesis Start Request](http://localhost:5173/start-request) page and see that effectively the start request is not shown.
    8. Log out
15. Log out
16. Log in with the student account with which we firstly created a thesis start request
17. Go to [Thesis Start Request](http://localhost:5173/start-request) -> you will see that the status of our start request has been correctly updated to '2/3 - Waiting for approval from the teacher'
18. Open another tab as before -> go to the [home page](http://localhost:5173/). We will refer to this as the 'teacher tab' (and the other one 'student tab')
19. Log in as the supervisor teacher of the thesis start request
20. Go to [Thesis Start Request](http://localhost:5173/start-request) -> you will see that the thesis start request is now present and we can opeate on it
21. There are four buttons. Let's click on the first one: 'info button' -> if we click on it on the right side will appear all the relevant information about the thesis start request
22. Let's click on the second button: 'Request Changes' button -> if we click on we are request to specify the changes that we want for that thesis start request -> let's complete it with some random text just to see the behavior -> send the 'Request Change'
23. Go on the student tab and refresh the thesis start request page -> you will see the request for changes(the status of the start request is now '2/3 - Changes requested')
23. Go again on the teacher tab -> the third button is 'Accept Thesis Start Request' -> click on it -> confirm the action by clicking 'Yes, accept the request' -> you will be informed by a pop-up that the start request have been accepted
24. Go to the student tab and refresh again -> you will see the status is now '3/3 - Accepted'
25. In the student tab log out, you can now close this tab
26. Log in as the secretary clerk
27. Accept another start request
28. Log in as the teacher who is the supervisor of the now accepted thesis start request
29. Let's click on the fourth button: reject start request
30. Log out
31. Log in as the student whose application has been rejected by the professor
32. Go to [Thesis Start Request](http://localhost:5173/start-request) -> you will see the status of the start request to be '2/3 - Rejected by the teacher, you can submit a new one'
33. Create another start request -> you will see that is possible
34. Log out


### [16] Notify Application
This test case is related to the possibility for a professor to be notified when a new application is sent. To check that we use Ethereal.

1. Open [Ethereal site](https://ethereal.email/login)
2. Log in with this credentials:
    - username: clemmie.reynolds@ethereal.email
    - password: RSHSTmvXCs9WFZnRmt
3. Click on [Messages](https://ethereal.email/messages)
4. Go to the [home page](http://localhost:5173/)
5. Log in as a professor
6. Click on 'Thesis Applications' in the left bar. You are now in [Thesis Applicaitons page](http://localhost:5173/applications) and you can see all the applications for the thesis
7. Reject an application
8. Log out
9. Log in as the student whose application has been rejected
10. Now for sure you can apply for another application, send the application for a thesis
11. Re-open the Ehereal web page and refresh it
12. You will be able to see that a message to the professor has been send, click on it to see all the details and check their correctness
13. Go back on the thesis web application page and log out

### [17] Proposal Expiration & Search Archive
In this test case we will show the correct behaviour of the application when a thesis proposal expires: it automatically becomes archived, and with this excuse we also show how the archive can be consulted.

1. Go to the [home page](http://localhost:5173/)
2. Log in as the teacher with id d279620 (important because he has also the admin role -> we will need to use the virtual clock)
3. The teacher we logged as have only one proposal: let's archive it (see: [Archive Proposal e2e Test](#12-archive-proposal)) 
4. On the left bar under 'Thesis Start Request' there is another button: with this we access the [Archive](http://localhost:5173/archive) -> we will see there the archived proposal with the status 'ARCHIVED'
5. In the archive we can operate on the proposal, in the actions column there three buttons:
    - [view proposal](http://localhost:5173/view-proposal/1) -> click on it -> we will see all the details of the proposal -> click then to the button 'back to archive'
    - [edit proposal](http://localhost:5173/edit-proposal/1) -> click on it -> let's modify some fields -> click on 'submit' and then 'next' in the changes review page -> in the 'proposal updated succesfully' page instead of clicking on the 'back home' button, click again on [Archive](http://localhost:5173/archive) in the left bar -> seeing the proposal again we will see that the changes have been correctly applied
    - publish proposal -> a pop-up will appear to confirm the action -> click on 'Yes, publish it'-> you will see now that the archive in this case is empty
6. Click now on 'tester settings' at the bottom of the left bar. It will appear the [virtual clock page](http://localhost:5173/admin/virtual-clock)
7. Choose a date exactly one day after or in general after the expiration date previously seen. Click on 'save new clock'
8. If you go again on [Thesis Proposals](http://localhost:5173/proposals) we will see that the proposal is not present anymore
9. Otherwise, if we go again on the [Archive](http://localhost:5173/archive) we will see that the proposal is there, this time with the status 'EXPIRED'
10. Let's add now a new thesis proposal (see [Create Proposal e2e test](#3-thesis-proposal-creation))
11. Let's go on [Thesis Proposals](http://localhost:5173/proposals) and archive it
12. Go on [Archive](http://localhost:5173/archive)
13. We now have two archived proposal with 2 different status (ARCHIVED AND EXPIRED). We want to test the filtering options are perfectly working. Clicking on 'Expiration' in the columns name we will see that effectively the archived proposals are sorted by expiration date. Clicking again we will have the same result, but in reversed order.
14. Try the filtering also with the other fields and we will see that it is correctly working.
10. Now we can log out
    - You should be again on the [home page](http://localhost:5173/)