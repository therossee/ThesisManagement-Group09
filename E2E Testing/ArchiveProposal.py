import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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

# Step 3: Go to Thesis Proposal page
thesis_proposal_link = driver.find_element_by_link_text("Thesis Proposal")
thesis_proposal_link.click()

# Step 4: Archive the last proposal
archive_button = driver.find_elements_by_css_selector(".action-button")[-1]
archive_button.click()

# Step 5: Confirm archiving
confirm_button = driver.find_element_by_id("confirm-button")
confirm_button.click()

# Step 6: Verify successful archiving
success_message = WebDriverWait(driver, 10).until(
    EC.text_to_be_present_in_element((By.ID, "success-message"), "Proposal archived successfully")
)
assert success_message

# Step 7: Log out
logout_button = driver.find_element_by_id("logout-button")
logout_button.click()

# Close the browser
driver.quit()
