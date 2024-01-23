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
continue_button = driver.find_element(By.XPATH, "//button[normalize-space()='Continue']")
continue_button.click();
print("Continue clicked")
print("Login successful as a TEACHER")

driver.implicitly_wait(5)
thesis_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_button.click();
print("Thesis Proposals clicked")

driver.implicitly_wait(5)
expiration_date_text = expiration_date_cell = driver.find_element(By.XPATH, "//tbody/tr[2]/td[8]").text
print("Expiration date: " + expiration_date_text)

driver.implicitly_wait(5)
driver.get("http://localhost:5173/admin/virtual-clock")
print("Virtual clock opened")


driver.implicitly_wait(5)
edit_button = driver.find_element(By.XPATH, "//span[@aria-label='edit']")
edit_button.click();
print("Edit button clicked")

driver.implicitly_wait(5)
date_field = driver.find_element(By.XPATH, "//input[@placeholder='Select date']")
date_field.click();
print("Date field clicked")

driver.implicitly_wait(5)
next_month_button = driver.find_element(By.XPATH, "//button[@class='ant-picker-header-next-btn']")
for i in range(0, 11):
    next_month_button.click();
print("Next month button clicked 11 times")

driver.implicitly_wait(5)
expiration_date_cell_virtualclock = driver.find_element(By.XPATH, "//div[@class='ant-picker-cell-inner'][normalize-space()='11']")
expiration_date_cell_virtualclock.click();
print("Expiration date cell clicked")

driver.implicitly_wait(5)
save_button = driver.find_element(By.XPATH, "//span[normalize-space()='SAVE NEW CLOCK']")
save_button.click();
print("Save button clicked")

driver.implicitly_wait(5)
thesis_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Proposals']")
thesis_button.click();
print("Thesis Proposals clicked")

driver.refresh()
driver.implicitly_wait(5)
try:
    text = driver.find_element(By.XPATH, "//tbody/tr[2]/td[8]").text
    print("TEST FAILED : PROPOSAL FOUND")
except Exception as e:
    print("TEST PASSED: PROPOSAL NOT FOUND")
