from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys # for sending keys suchn as ENTER, RETURN...
from selenium.webdriver.common.by import By
import datetime

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
day_button = driver.find_element(By.XPATH, "//div[@class='ant-picker-cell-inner'][normalize-space()='24']")
day_button.click();
print("Day button clicked")

#SAVE DATE
driver.implicitly_wait(5)
save_button = driver.find_element(By.XPATH, "//span[normalize-space()='SAVE NEW CLOCK']")
save_button.click();
print("Save button clicked")

#CHECK THE ACTUAL DATE WITH THE VIRTUAL NEW DATE
actual_date = datetime.datetime.now()

driver.implicitly_wait(5)
new_date = driver.find_element(By.XPATH, "//div[@class='ant-space css-dev-only-do-not-override-2i2tap ant-space-vertical ant-space-align-center ant-space-gap-row-small ant-space-gap-col-small']//div[1]")
print("New date: " + new_date.text)
print("Actual date: " + actual_date.strftime("%d/%m/%Y"))
actual_date = actual_date.strftime("%d/%m/%Y")

new_date_day = new_date.text
new_date_day = new_date_day[4:6]

new_date_year = new_date.text
new_date_year = new_date_year[8:12]

new_date_month = new_date.text
new_date_month = new_date_month[0:2]
if new_date_month == "Dec":
    new_date = "12"
elif new_date_month == "Nov":
    new_date = "11"
elif new_date_month == "Oct":
    new_date = "10"
elif new_date_month == "Sep":
    new_date = "09"
elif new_date_month == "Aug":
    new_date = "08"
elif new_date_month == "Jul":
    new_date = "07"
elif new_date_month == "Jun":
    new_date = "06"
elif new_date_month == "May":
    new_date = "05"
elif new_date_month == "Apr":
    new_date = "04"
elif new_date_month == "Mar":
    new_date = "03"
elif new_date_month == "Feb":
    new_date = "02"
else:
    new_date = "01"

new_date = new_date_day + "/" + new_date + "/" + new_date_year

formato = "%d/%m/%Y"

new_date_obj = datetime.datetime.strptime(new_date, formato)
actual_date_obj = datetime.datetime.strptime(actual_date, formato)

if new_date_obj < actual_date_obj:
    raise Exception("TEST FAILED: The date is correct") 
elif new_date_obj > actual_date_obj:
    print("TEST PASSED: The date is correct") 
else:
    raise Exception("TEST FAILED: The date is correct") 
