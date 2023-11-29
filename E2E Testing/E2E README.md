# End 2 End testing

## Tests for Stories

### [6] Browse Applications Decision

In this section, we verify that the student can see the list of decisions on his applications.

#### Test 1 -> Waiting for approval
Steps:
1. Login as a student
2. Type the email of a student registered in the DB in the mail text area which it's located at the top right of the screen:
  email: s320213@studenti.polito.it
3. Type the password of that student user in the password field at the right of the email field.
  password: s320213
4. Click on Log in
5. Once we're succesfully logged in go to the left vertical box of the page and click on "Application history"
6. In this page we are seeing a timeline of things that are happening in our thesis application, in this case we asume that we applied before for this thesis
  so the screen shows the name of the Thesis and below the status, in this case "waiting for approval".

#### Test 2 -> Application aproved
1. Login as a student
2. Type the email of a student registered in the DB in the mail text area which it's located at the top right of the screen:
  email: s320213@studenti.polito.it
3. Type the password of that student user in the password field at the right of the email field.
  password: s320213
4. Click on Log in
5. Once we're succesfully logged in go to the left vertical box of the page and click on "Application history"
6. In this page we are seeing a timeline of things that are happening in our thesis application, in this case we asume that:
  1ºWe applied before for this thesis.
  2º The teacher alredy aproved the thesis.
  so the screen shows the name of the Thesis and below the status, in this case "accepted".
