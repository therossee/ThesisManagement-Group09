
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys # for sending keys suchn as ENTER, RETURN...
from selenium.webdriver.common.by import By


options = Options()
options.add_experimental_option("detach", True) # keep browser open after test

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),
                          options=options) # install chromedriver

driver.get("http://localhost:5173/")
driver.maximize_window()

driver.implicitly_wait(5)
login_button = driver.find_element(By.XPATH, "//span[normalize-space()='Log in']")
login_button.click();
print("Login clicked")

driver.implicitly_wait(5)
user_field = driver.find_element(By.XPATH, "//input[@id='username']")
user_field.send_keys("s320213@studenti.polito.it")
print("User inserted")

driver.implicitly_wait(5)
password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("s320213")
print("Password inserted")

driver.implicitly_wait(5)
continue_button = driver.find_element(By.XPATH, "//div[@class='cdc80f5fa']")
continue_button.click();
print("Continue clicked")
print("Login successful as a STUDENT")


driver.implicitly_wait(5)
applications_history_button = driver.find_element(By.XPATH, "//span[normalize-space()='Applications History']")
applications_history_button.click();
print("applications history clicked")

#TEST 1: CHECK ACTUAL STATUS
driver.implicitly_wait(5)
status_string = driver.find_element(By.XPATH, "//span[@class='ant-badge-status-text']")
print(status_string.text)

#Checking there are no applications or only rejected applications
driver.implicitly_wait(5)
refresh_status_button = driver.find_element(By.XPATH, "//span[normalize-space()='Refresh List']")
 
if status_string.text == "accepted":
    driver.quit()
    print("Test failed: cannot apply for a proposal if already one is accepted")
elif status_string.text == "waiting for approval":
    print("Continue with the test")
elif status_string.text == "rejected":
    print("Continue with the test")
else:
    print("Continue with the test")

#TEST 2: APPLY FOR A PROPOSAL
#Click on thesis proposals
driver.implicitly_wait(5)
thesis_proposals_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposals_button.click();
print("Thesis proposals clicked")

#Click on eye button
driver.implicitly_wait(5)
eye_button = driver.find_element(By.CSS_SELECTOR, "tbody tr:nth-child(2) td:nth-child(9) div:nth-child(1) div:nth-child(1) span:nth-child(1)")
eye_button.click();
print("Eye clicked")

#Click on application button
driver.implicitly_wait(5)
applications_history_button = driver.find_element(By.XPATH, "//span[normalize-space()='Applications History']")
applications_history_button.click();
print("applications history clicked")

driver.implicitly_wait(5)
status_string = driver.find_element(By.XPATH, "//span[@class='ant-badge-status-text']")
if status_string.text == "waiting for approval":
    print("Test passed")
elif status_string.text == "accepted" or status_string.text == "rejected":
    driver.quit()
    print("Test failed: remember to run the test with a user that has no accepted or rejected applications")
