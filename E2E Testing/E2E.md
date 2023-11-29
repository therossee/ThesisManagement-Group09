# End 2 End Testing
This file contains the information related to the end 2 end testing of the project. Basically, it contains reference to each detailed test case with some more information.

## Table of Contents
TODO

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
2. Click on the menu button "Administration"
    - You should access to the [virtual clock administration page](http://localhost:5173/admin/virtual-clock)
    - The clock should be set to the current time in your timezone
3. Click on edit button
    - The clock shown on the input should be set to the current time in your timezone
4. Change the time by adding some days, hours, minutes and seconds 
   - Don't forget to click on "OK"
5. Save the changes by clicking on the "SAVE NEW CLOCK" button
   - You should see the same page as step 2 but with the new clock you indicated
6. Click on the button "RESET OFFSET"
   - The clock shown should be set to the current time in your timezone

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
4. TODO (not implemented yet)

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



#### [8] Browse application decisions
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