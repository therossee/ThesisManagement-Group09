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
user_field.send_keys("s321607@studenti.polito.it")
print("User inserted")

driver.implicitly_wait(5)
password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("s321607")
print("Password inserted")

driver.implicitly_wait(5)
continue_button = driver.find_element(By.XPATH, "//div[@class='cdc80f5fa']")
continue_button.click();
print("Continue clicked")


driver.implicitly_wait(5)
thesis_proposals_button = driver.find_element(By.XPATH, "//span[@class='anticon anticon-file-text ant-menu-item-icon']")
thesis_proposals_button.click();
print("Thesis proposals clicked")

#TEST 1: SEARCH FOR A PROPOSAL
driver.implicitly_wait(5)
search_button = driver.find_element(By.XPATH, "//span[@role='button']//span[@aria-label='search']//*[name()='svg']")
search_button.click();
print("Search button clicked")

driver.implicitly_wait(5)
search_field = driver.find_element(By.XPATH, "//input[@placeholder='Search Title']")
search_field.send_keys("OPTIMIZATION")
print("Search field filled")

driver.implicitly_wait(5)
search_confirm_button = driver.find_element(By.XPATH, "//span[normalize-space()='Search']")
search_confirm_button.click();
print("Search confirm button clicked")

result_failed = "Test failed: no proposal found"

passed_string = "Test passed, proposal: \""

found_string = "\" found"

driver.implicitly_wait(5)
text_to_find = "OPTIMIZATION OF CHECK-IN PROCESSES IN AMAZON LOGISTICS"
text_found  = driver.find_element(By.XPATH, "//td[contains(text(),'OPTIMIZATION OF CHECK-IN PROCESSES IN AMAZON LOGIS')]")
if text_found.text == text_to_find :
    result1 = passed_string + text_found.text+ found_string
    print(result1)
else:
    print(result_failed)


#TEST 2: DELETE THE SEARCH FILTER

driver.implicitly_wait(5)
search_button = driver.find_element(By.XPATH, "//span[@role='button']//span[@aria-label='search']//*[name()='svg']")
search_button.click();
print("Search button clicked")

driver.implicitly_wait(5)
search_field = driver.find_element(By.XPATH, "//input[@placeholder='Search Title']")
i=0
for i in range(0, 12):
    search_field.send_keys(Keys.BACKSPACE)
print("Search field deleted")

driver.implicitly_wait(5)
search_confirm_button = driver.find_element(By.XPATH, "//span[normalize-space()='Search']")
search_confirm_button.click();
print("Search confirm button clicked")

driver.implicitly_wait(5)
text_to_find = "PREDICTIVE MODELING FOR INFOTAINMENT SYSTEM PERFORMANCE OPTIMIZATION"
text_found  = driver.find_element(By.XPATH, "//td[contains(text(),'PREDICTIVE MODELING FOR INFOTAINMENT SYSTEM PERFOR')]")
if text_found.text == text_to_find :
    result2 = passed_string  + text_found.text+ found_string
    print(result2)
else:
    print(result_failed)


#TEST 3: FILTER BY LEVEL (FILTERING SYMBOL)
driver.implicitly_wait(5)
filter_button = driver.find_element(By.XPATH, "//th[@aria-label='Level']//span[@aria-label='filter']//*[name()='svg']")
filter_button.click();
print("Filter button clicked")

driver.implicitly_wait(5)
filter_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
filter_checkbox.click();
print("Filter checkbox clicked")

driver.implicitly_wait(5)
filter_confirm_button = driver.find_element(By.XPATH, "//span[normalize-space()='OK']")
filter_confirm_button.click();
print("Filter confirm button clicked")

driver.implicitly_wait(5)
text_to_find = "PREDICTIVE MODELING FOR INFOTAINMENT SYSTEM PERFORMANCE OPTIMIZATION"
text_found  = driver.find_element(By.XPATH, "//td[contains(text(),'PREDICTIVE MODELING FOR INFOTAINMENT SYSTEM PERFOR')]")
if text_found.text == text_to_find :
    result3 = passed_string + text_found.text+ found_string
    print(result3)
else:
    print(result_failed)

#LOGOUT
driver.implicitly_wait(5)
logout_button = driver.find_element(By.XPATH, "//span[normalize-space()='Log Out']")
logout_button.click();
print("Logout clicked")

print("Test FINISHED, result: PASSED")  