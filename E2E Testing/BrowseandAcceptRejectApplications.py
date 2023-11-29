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
mail_field.send_keys("rossi.marco@email.com")
print("User inserted")

password_field = driver.find_element(By.XPATH, "//input[@placeholder='Password']")
password_field.send_keys("d279620")
print("Password inserted")

login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
login_button.send_keys(Keys.RETURN) # press enter
print("Login clicked")

thesis_applications_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Applications']")
thesis_applications_button.click()
print("Thesis applications clicked")

accept_button = driver.find_element(By.XPATH, "//button[@class='ant-btn css-dev-only-do-not-override-2i2tap ant-btn-primary ant-btn-icon-only ant-btn-background-ghost']")
accept_button.click()
print("Accept button clicked")

application_text=driver.find_element(By.XPATH, "//h3[@class='ant-typography css-dev-only-do-not-override-2i2tap']")
if application_text.text == "No applications pending..":
    print("Application has been accepted correctly")
else:
    driver.quit()
    raise Exception("Test failed: application has not been accepted correctly")
