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
continue_button = driver.find_element(By.XPATH, "//div[@class='cdc80f5fa']")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

driver.implicitly_wait(5)
thesis_applications_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Applications']")
thesis_applications_button.click()
print("Thesis applications clicked")

driver.implicitly_wait(5)
accept_button = driver.find_element(By.XPATH, "//button[@class='ant-btn css-dev-only-do-not-override-2i2tap ant-btn-primary ant-btn-icon-only ant-btn-background-ghost']")
if accept_button is None:
    driver.quit()
    print("Test failed: no proposals to accept")
else:
    accept_button.click()
    print("Accept button clicked")

driver.implicitly_wait(5)
application_text=driver.find_element(By.XPATH, "//h3[@class='ant-typography css-dev-only-do-not-override-2i2tap']")
if application_text.text == "No applications pending..":
    print("Application has been accepted correctly")
else:
    driver.quit()
    print("Test failed: application has not been accepted correctly")

driver.implicitly_wait(5)
thesis_proposals_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_proposals_button.click();
print("Thesis proposals clicked")

driver.implicitly_wait(5)
row_proposal = driver.find_element(By.CSS_SELECTOR, "//h3[normalize-space()='No applications pending..']")
if row_proposal.text == None :
    print("Test passed, proposal have been removed due to acceptance")
else:
    driver.quit()
    print("Test failed: proposal has not been removed")