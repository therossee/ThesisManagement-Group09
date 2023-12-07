
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

mail_field = driver.find_element(By.XPATH, "//input[@placeholder='Email']")
mail_field.send_keys("s320213@studenti.polito.it")
print("User inserted")

password_field = driver.find_element(By.XPATH, "//input[@placeholder='Password']")
password_field.send_keys("s320213")
print("Password inserted")

login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
login_button.send_keys(Keys.RETURN) # press enter
print("Login clicked")


applications_history_button = driver.find_element(By.XPATH, "//span[normalize-space()='Applications History']")
applications_history_button.click();
print("applications history clicked")


status_string = driver.find_element(By.XPATH, "//span[@class='ant-badge-status-text']")
print(status_string.text)

#Checking there are no applications or only rejected applications
refresh_status_button = driver.find_element(By.XPATH, "//span[normalize-space()='Refresh List']")
 
if status_string.text == "accepted":
    driver.quit()
    raise Exception("Test failed: cannot apply for a proposal if already one is accepted")
elif status_string.text == "waiting for approval":
    pass
elif status_string.text == "rejected":
    pass
else:
    pass

#Click on thesis proposals
thesis_proposals_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposals_button.click();
print("Thesis proposals clicked")

#Click on eye button
eye_button = driver.find_element(By.CSS_SELECTOR, "tbody tr:nth-child(2) td:nth-child(9) div:nth-child(1) div:nth-child(1) span:nth-child(1)")
eye_button.click();
print("Eye clicked")

#Click on apply button
apply_button = driver.find_element(By.XPATH, "//button[@class='ant-btn css-dev-only-do-not-override-2i2tap ant-btn-primary ant-btn-background-ghost']")
apply_button.click();
print("Apply for proposal clicked")

#Click on application button
applications_history_button = driver.find_element(By.XPATH, "//span[normalize-space()='Applications History']")
applications_history_button.click();
print("applications history clicked")

if status_string.text == "waiting for approval":
    print("Test passed")
elif status_string.text == "accepted" or status_string.text == "rejected":
    driver.quit()
    raise Exception("Test failed: remember to run the test with a user that has no accepted or rejected applications")