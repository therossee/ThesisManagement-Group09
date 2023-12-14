from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up the WebDriver
driver = webdriver.Chrome()

# Step 1: Go to the home page
driver = webdriver.Chrome()
driver.get("http://localhost:5173/")

# Step 2: Log in as a teacher
user_field = driver.find_element(By.XPATH, "//input[@id='username']")
user_field.send_keys("d255269@polito.it")
print("User inserted")

password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("d255269")
print("Password inserted")

# Find and click the login button
login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Log In')]")
login_button.click()

# Step 3: Click on 'Thesis Proposal' in the left bar
thesis_proposal_link = driver.find_element(By.LINK_TEXT, "Thesis Proposal")
thesis_proposal_link.click()


copy_button = driver.find_element(By.XPATH, "//td[contains(text(), 'Actions')]/following-sibling::td/button[contains(@class, 'copy-button')]")
copy_button.click()

assert driver.find_element(By.ID, "field1").get_attribute("value") == "value1"
assert driver.find_element(By.ID, "field2").get_attribute("value") == "value2"
assert driver.find_element(By.ID, "field3").get_attribute("value") == "value3"


field1_input = driver.find_element(By.ID, "field1")
field1_input.clear()
field1_input.send_keys("new_value1")

field2_input = driver.find_element(By.ID, "field2")
field2_input.clear()
field2_input.send_keys("new_value2")

field3_input = driver.find_element(By.ID, "field3")
field3_input.clear()
field3_input.send_keys("new_value3")


submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
submit_button.click()


next_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Next')]")
next_button.click()

# Step 10: Verify that the proposal is uploaded successfully
success_message = driver.find_element(By.XPATH, "//div[contains(text(), 'Success!')]")
assert success_message.is_displayed()

# Step 11: Go back to the home page
back_home_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Back Home')]")
back_home_button.click()

# Step 12: Log out
logout_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Log Out')]")
logout_button.click()

# Close the WebDriver
driver.quit()
