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

driver2 = webdriver.Chrome(service=Service(ChromeDriverManager().install()),
                          options=options) 

driver.get("https://ethereal.email/login")
driver.maximize_window()

driver.implicitly_wait(5)
user_field = driver.find_element(By.XPATH, "//input[@id='address']")
user_field.send_keys("clemmie.reynolds@ethereal.email")
print("User inserted")

driver.implicitly_wait(5)
password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("RSHSTmvXCs9WFZnRmt")
print("Password inserted")

driver.implicitly_wait(5)
continue_button = driver.find_element(By.CSS_SELECTOR, "button[class='btn btn-primary']")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

driver.implicitly_wait(5)
driver.get("https://ethereal.email/messages")

driver2.get("http://localhost:5173/")
driver2.maximize_window()

driver2.implicitly_wait(5)
login_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Log in']")
login_button.click();
print("Login clicked")

driver2.implicitly_wait(5)
user_field = driver2.find_element(By.XPATH, "//input[@id='username']")
user_field.send_keys("d292715@polito.it")
print("User inserted")

driver2.implicitly_wait(5)
password_field = driver2.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("d292715")
print("Password inserted")

driver2.implicitly_wait(5)
continue_button = driver2.find_element(By.CSS_SELECTOR, ".c9d281cd0")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

driver2.implicitly_wait(5)
thesis_application_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Thesis Applications']")
thesis_application_button.click();
print("Thesis application clicked")

driver2.implicitly_wait(5)
reject_button = driver2.find_element(By.XPATH, "(//button[@type='button'])[4]")
reject_button.click();
print("Reject clicked")

driver2.implicitly_wait(5)
log_out_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Log Out']")
log_out_button.click();
print("Log out clicked")

driver2.implicitly_wait(5)
login_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Log in']")
login_button.click();
print("Login clicked")

driver2.implicitly_wait(5)
user_field = driver2.find_element(By.XPATH, "//input[@id='username']")
user_field.send_keys("s321607@studenti.polito.it")
print("User inserted")

driver2.implicitly_wait(5)
password_field = driver2.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("s321607")
print("Password inserted")

driver2.implicitly_wait(5)
continue_button = driver2.find_element(By.CSS_SELECTOR, ".c9d281cd0")
continue_button.click();
print("Continue clicked")
print("Login successful as a STUDENT")

driver2.implicitly_wait(5)
thesis_proposal_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposal_button.click();
print("Thesis proposal clicked")

driver2.implicitly_wait(5)
view_button = driver2.find_element(By.XPATH, "(//span[@aria-label='eye'])[1]")
view_button.click();
print("View clicked")

driver2.implicitly_wait(5)
apply_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Apply for proposal']")
apply_button.click();
print("Apply clicked")

driver2.implicitly_wait(5)
send_button = driver2.find_element(By.XPATH, "//span[normalize-space()='Send']")
send_button.click();
print("Send clicked")


driver.refresh()
driver.implicitly_wait(5)
try:
    text = driver.find_element(By.XPATH, "//a[contains(text(),'Application status changed - OPTIMIZATION OF CHECK')]").text
    print("TEST PASSED")
except Exception as e:
    print(f"TEST NOT PASSED DUE TO EXCEPTION: {str(e)}")

