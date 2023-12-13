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

cond = 3
refresh_status_button = driver.find_element(By.XPATH, "//span[normalize-space()='Refresh List']")
while cond>0:
    if status_string.text == "accepted":
        print("Test passed: application accepted")
        refresh_status_button.click()
    elif status_string.text == "waiting for approval":
        print("Test passed: application waiting for approval")
        refresh_status_button.click()
    elif status_string.text == "rejected":
        print("Test passed: application rejected")
        refresh_status_button.click()
    else:
        driver.quit()
        print("Test failed: application status not recognized")
    cond = cond - 1





