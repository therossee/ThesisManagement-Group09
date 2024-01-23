from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys # for sending keys suchn as ENTER, RETURN...
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import requests

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
user_field.send_keys("d279620@polito.it")
print("User inserted")

driver.implicitly_wait(5)
password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("d279620")
print("Password inserted")

driver.implicitly_wait(5)
continue_button = driver.find_element(By.XPATH, "//button[normalize-space()='Continue']")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

driver.implicitly_wait(5)
thesis_proposal_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposal_button.click();
print("Thesis Proposal clicked")
print("Thesis Proposal page opened")

# Step 4: Archive the last proposal
driver.implicitly_wait(5)
archive_button = driver.find_element(By.XPATH, "//tbody/tr[2]/td[9]/div[1]/div[5]")
archive_button.click()
print("Archive button clicked")

# Step 5: Confirm archiving
driver.implicitly_wait(5)
confirm_button = driver.find_element(By.XPATH, "//span[normalize-space()='Yes, archive it']")
confirm_button.click()
print("Confirm button clicked")

# Step 6: Verify that the proposal is archived
driver.implicitly_wait(5)
driver.get("http://localhost:5173/archive")
print("Archive page opened")

driver.implicitly_wait(5)
driver.get("http://localhost:5173/view-proposal/1")
print("Proposal page opened")

driver.implicitly_wait(5)
driver.get("http://localhost:5173/edit-proposal/1")
print("Edit page opened")

driver.implicitly_wait(5)
title_Field = driver.find_element(By.XPATH, "//input[@id='title']")
title_Field.send_keys("Testing the edit and archived proposal")
print("Title inserted")

driver.implicitly_wait(5)
submit_button = driver.find_element(By.XPATH, "//span[normalize-space()='Submit']")
submit_button.click()
print("Submit button clicked")

driver.implicitly_wait(5)
next_button = driver.find_element(By.XPATH, "//span[normalize-space()='Next']")
next_button.click()
print("Next button clicked")



