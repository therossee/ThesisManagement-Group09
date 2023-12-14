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

string_passed = "Test passed, proposal: \""
string_found = "\" found"

driver.implicitly_wait(5)
text_to_find = "OPTIMIZATION OF CHECK-IN PROCESSES IN AMAZON LOGISTICS"
text_found  = driver.find_element(By.XPATH, "//td[contains(text(),'OPTIMIZATION OF CHECK-IN PROCESSES IN AMAZON LOGIS')]")
result = string_passed + text_found.text+string_found
result_failed = "Test failed: no proposal found"
if text_found.text == text_to_find :
    print(result)
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
XPATH_text_found = "//td[contains(text(),'PREDICTIVE MODELING FOR INFOTAINMENT SYSTEM PERFOR')]"
text_found  = driver.find_element(By.XPATH, XPATH_text_found)
result = string_passed + text_found.text+string_found
if text_found.text == text_to_find :
    print(result)
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
text_found  = driver.find_element(By.XPATH, XPATH_text_found)
result = string_passed + text_found.text+string_found
if text_found.text == text_to_find :
    print(result)
else:
    print(result_failed)


#TEST 4: FILTER BY LEVEL, RESET FILTER (FILTERING SYMBOL)

driver.implicitly_wait(5)
filter_button = driver.find_element(By.XPATH, "//th[@aria-label='Level']//span[@aria-label='filter']//*[name()='svg']")
filter_button.click();
print("Filter 2 button clicked ")

driver.implicitly_wait(5)
filter_reset_button = driver.find_element(By.XPATH, "//button[@class='ant-btn css-dev-only-do-not-override-2i2tap ant-btn-link ant-btn-sm']//span[contains(text(),'Reset')]")
filter_reset_button.click();
print("Filter reset button clicked")

driver.implicitly_wait(5)
filter_confirm_button = driver.find_element(By.XPATH, "//span[normalize-space()='OK']")
filter_confirm_button.click();
print("Filter confirm button clicked")

driver.implicitly_wait(5)
text_found  = driver.find_element(By.XPATH, XPATH_text_found)
result = string_passed + text_found.text+string_found
if text_found.text == text_to_find :
    print(result)
else:
    print(result_failed)

#TEST 5: SUPERVISOR FILTER - SEARCH FOR A SUPERVISOR

driver.implicitly_wait(5)
filter_button = driver.find_element(By.XPATH, "//th[3]//div[1]//span[2]//span[1]")
filter_button.click();
print("Filter 3 button clicked")

driver.implicitly_wait(5)
filter_search_field = driver.find_element(By.XPATH, "//input[@placeholder='Search in filters']")
filter_search_field.send_keys("Isabella")
print("Filter search field filled")

driver.implicitly_wait(5)
filter_ok_button = driver.find_element(By.XPATH, "//div[@class='ant-dropdown css-dev-only-do-not-override-2i2tap ant-dropdown-placement-bottomRight']//span[contains(text(),'OK')]")
filter_ok_button.click();
print("Filter ok button clicked")

driver.implicitly_wait(5)
text_to_find = "Isabella Gatti"
text_found  = driver.find_element(By.XPATH, "//body[1]/div[1]/div[1]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/table[1]/tbody[1]/tr[2]/td[3]/span[1]")
result = string_passed + text_found.text+string_found
if text_found.text == text_to_find :
    print(result)
else:
    print("Test failed: no supervisor found")

#ALL THE OTHER FILTERS ARE IMPLEMENTED EXACTLY IN THE SAME WAY AS THE PREVIOUS ONES, SO THEY ARE NOT TESTED.