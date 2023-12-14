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


driver.implicitly_wait(5)
url_new = 'http://localhost:5173/proposals'
driver.get(url_new)
driver.maximize_window()

driver.implicitly_wait(5)
not_authorized_text = driver.find_element(By.XPATH, "//div[@class='ant-result-title']")
print("Text found: " + not_authorized_text.text)
test_text = "You are not authorized to access this page."

if not_authorized_text.text == test_text:
    print("TEST PASSED: You are not authorized to access this page.")
else:
    driver.quit()
    print("TEST FAILED: You are not authorized to access this page.")

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
continue_button = driver.find_element(By.XPATH, "//div[@class='cdc80f5fa']")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

print("TEST PASSED")