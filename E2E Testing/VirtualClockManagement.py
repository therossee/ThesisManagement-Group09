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

#ENTER THE ADMINISTRATION PAGE
driver.implicitly_wait(5)
administration_button = driver.find_element(By.XPATH, "//span[normalize-space()='Administration']")
administration_button.click();
print("Administration button clicked")

#ENTER THE EDIT BUTTON
driver.implicitly_wait(5)
edit_button = driver.find_element(By.XPATH, "//span[normalize-space()='EDIT']")
edit_button.click();
print("Edit button clicked")

#SELECT THE DATE
driver.implicitly_wait(5)
date_field = driver.find_element(By.XPATH, "//input[@placeholder='Select date']")
date_field.click();
print("Date field clicked")

#CLICK >> BUTTON TO ADVANCE A YEAR
driver.implicitly_wait(5)
year_button = driver.find_element(By.XPATH, "//button[@class='ant-picker-header-super-next-btn']")
year_button.click();
print("Year button clicked")

#SELECT THE DAY
driver.implicitly_wait(5)
day_button = driver.find_element(By.XPATH, "//td[@title='2024-12-11']//div[@class='ant-picker-cell-inner'][normalize-space()='11']")
day_button.click();
print("Day button clicked")

#SAVE DATE
driver.implicitly_wait(5)
save_button = driver.find_element(By.XPATH, "//span[normalize-space()='SAVE NEW CLOCK']")
save_button.click();
print("Save button clicked")
