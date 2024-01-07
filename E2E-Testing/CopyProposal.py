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
user_field.send_keys("d279620@polito.it")
print("User inserted")

driver.implicitly_wait(5)
password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("d279620")
print("Password inserted")

driver.implicitly_wait(5)
continue_button = driver.find_element(By.CSS_SELECTOR, ".cff0ff2c6")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

driver.implicitly_wait(5)
thesis_proposal_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposal_button.click();
print("Thesis Proposal clicked")
print("Thesis Proposal page opened")

driver.implicitly_wait(5)
copy_proposal_button = driver.find_element(By.XPATH, "//span[@aria-label='copy']//*[name()='svg']")
copy_proposal_button.click();
print("Copy Proposal clicked")

#Changing the title of the proposal for testing purposes
driver.implicitly_wait(5)
title_field = driver.find_element(By.XPATH, "//input[@id='title']")
i = 0
for i in range(0, 100):
    title_field.send_keys(Keys.BACK_SPACE)
title_field.send_keys("Test Proposal")
print("Title changed")

#Subitting the proposal
driver.implicitly_wait(5)
submit_button = driver.find_element(By.XPATH, "//span[normalize-space()='Submit']")
submit_button.click();
print("Proposal submitted")

#Reviewing the proposal
driver.implicitly_wait(5)
next_button = driver.find_element(By.XPATH, "//span[normalize-space()='Next']")
next_button.click();
print("Next clicked")

#Back home
driver.implicitly_wait(5)  
home_button = driver.find_element(By.XPATH, "//span[normalize-space()='Back Home']")
home_button.click();
print("Home clicked")

print("Test successful, proposal copied successfully")