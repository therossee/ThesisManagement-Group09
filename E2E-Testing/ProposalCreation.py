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
user_field.send_keys("rossi.marco@email.com")
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


#TEST : Create a new proposal
driver.implicitly_wait(5)
new_proposal_button = driver.find_element(By.XPATH, "//span[@aria-label='file-add']")
new_proposal_button.click();
print("New proposal button clicked")

#We insert the mandatory fields.
driver.implicitly_wait(5)
title_field = driver.find_element(By.XPATH, "//input[@id='title']")
title_field.send_keys("Proposal Title")
print("Title inserted")

driver.implicitly_wait(5)
keywords_field = driver.find_element(By.XPATH, "//body[1]/div[1]/div[1]/div[1]/main[1]/div[2]/div[1]/form[1]/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]")
keywords_field.click();
print("Keywords field clicked")

driver.implicitly_wait(5)
keyword_field_selection = driver.find_element(By.XPATH, "//div[@class='ant-select-item-option-content'][normalize-space()='kafka']")
keyword_field_selection.click();
print("Keyword selected")
#keyword_field_selection.send_keys(Keys.ESCAPE)

driver.implicitly_wait(5)
type_field = driver.find_element(By.XPATH, "//input[@id='type']")
type_field.send_keys("Proposal Type")
print("Type inserted")

driver.implicitly_wait(5)
description_field = driver.find_element(By.XPATH, "//textarea[@id='description']")
description_field.send_keys("Proposal Description")
print("Description inserted")

driver.implicitly_wait(5)
expiration_date_field = driver.find_element(By.XPATH, "//input[@id='expirationDate']")
expiration_date_field.click();
print("Expiration date field clicked")

driver.implicitly_wait(5)
expiration_date_day = driver.find_element(By.XPATH, "//td[@title='2023-12-31']")
expiration_date_day.click();
print("Expiration date day selected")

driver.implicitly_wait(5)
degree_level_field = driver.find_element(By.XPATH, "//input[@id='degreeLevel']")
degree_level_field.click()
print("Degree level field clicked")

driver.implicitly_wait(5)
degree_level_field_selection = driver.find_element(By.XPATH, "//div[contains(text(),'L - Bachelor Degree')]")
degree_level_field_selection.click()
print("Degree level selected")

driver.implicitly_wait(5)
cds_field = driver.find_element(By.XPATH, "//input[@id='cds']")
cds_field.click()
print("CDS field clicked")

driver.implicitly_wait(5)
cds_field_selection = driver.find_element(By.XPATH, "//div[contains(text(),'Ingegneria Elettronica')]")
cds_field_selection.click()
print("CDS selected")


driver.implicitly_wait(5)
submit_button = driver.find_element(By.XPATH, "//span[normalize-space()='Submit']")
submit_button.click()
print("Submit button clicked")

driver.implicitly_wait(5)
ok_button = driver.find_element(By.XPATH, "//span[normalize-space()='Next']")
ok_button.click()
print("Ok button clicked")

driver.implicitly_wait(5)
text_passed = driver.find_element(By.XPATH, "//div[@class='ant-result-title']")
text_passed = text_passed.text
if text_passed == "Proposal added succesfully!":
    print("Test passed")
else:
    print("Test failed")






