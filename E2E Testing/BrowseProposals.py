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

thesis_proposals_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposals_button.click();
print("Thesis proposals clicked")

row_proposal = driver.find_element(By.CSS_SELECTOR, "td[class='ant-table-cell ant-table-cell-fix-left ant-table-cell-fix-left-last']")

if row_proposal.text != None :
    print("Test passed, proposal: " + row_proposal.text+" found")
else:
    raise Exception("Test failed: no proposal found")


