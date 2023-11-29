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
   - Once logged out, the page should be refreshed, and you should see the page indicating that you are not authorized
     to access this page


# -- TO ADD NEW ONES HERE --



#### [] Browse application decisions

Verification that each student can see the history of their applications and the decision for each of them.


1. Go to the [home page](http://localhost:5173/)
2. Login as a student
3. Click on "Applications History" placed in the left bar, under "Thesis Proposals" [Application History](http://localhost:5173/applications)
4. Ensure that the history of applications is correctly viewed

### [] Browse Proposals

Verification that each teacher can view the list of active thesis proposals.

1. Go to the [home page](http://localhost:5173/)
2. Login as a student
3. Click on "Thesis Applications" placed in the left bar, under "Thesis Proposals" [Thesis Applications](http://localhost:5173/applications)
4. Ensure that the active thesis proposals are listed there 