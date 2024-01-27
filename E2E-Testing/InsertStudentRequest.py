
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
continue_button = driver.find_element(By.XPATH, "//button[normalize-space()='Continue']")
continue_button.click();
print("Continue clicked")
print("Login successful as a STUDENT")

driver.implicitly_wait(5)
start_request_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Start Request']")
start_request_button.click();
print("Start request clicked")

driver.implicitly_wait(5)
add_new_start_request_button = driver.find_element(By.XPATH, "//span[normalize-space()='Add New Thesis Start Request']")
add_new_start_request_button.click();
print("Add new start request clicked")

driver.implicitly_wait(5)
title_field = driver.find_element(By.XPATH, "//input[@id='validateOnly_title']")
title_field.send_keys("Test title")
print("Title inserted")

driver.implicitly_wait(5)
description_field = driver.find_element(By.XPATH, "//textarea[@id='validateOnly_description']")
description_field.send_keys("Test description")
print("Description inserted")

driver.implicitly_wait(5)
supervisor_selection = driver.find_element(By.XPATH, "//input[@id='validateOnly_supervisor_id']")
supervisor_selection.click();
print("Supervisor selection clicked")

driver.implicitly_wait(5)
supervisor_selection_person = driver.find_element(By.XPATH, "//div[contains(text(),'Francesca Barbieri')]")
supervisor_selection_person.click();
print("Supervisor selected")

driver.implicitly_wait(5)
submit_button = driver.find_element(By.XPATH, "//span[normalize-space()='Submit']")
submit_button.click();
print("Submit clicked")

driver.implicitly_wait(5)
try:
    test_text = thesis_cell = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Start Request Title']").text
    print("TEST PASSED : REQUEST CREATED")
except Exception as e:
    print("TEST FAILED: THE REQUEST HAS NOT BEEN CREATED")