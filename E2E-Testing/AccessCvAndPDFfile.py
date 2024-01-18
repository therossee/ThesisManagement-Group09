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

# Step 3: Click on 'Thesis Applications' in the left bar
driver.implicitly_wait(5)
thesis_applications_button = driver.find_element(By.XPATH, "//span[normalize-space()='Thesis Applications']")
thesis_applications_button.click()
print("Thesis Applications clicked")

# Step 4: Click on a student
driver.implicitly_wait(5)
student_button = driver.find_element(By.XPATH, "//h4[normalize-space()='Barbato Luca']")
student_button.click()
print("Student clicked")

# Step 5: Click on "View attached pdf" button
driver.implicitly_wait(5)
view_pdf_button = driver.find_element(By.XPATH, "//span[normalize-space()='View attached PDF']")
view_pdf_button.click()
print("View attached pdf clicked")

# Step 6: Verify that the pdf file is visible
driver.implicitly_wait(5)
new_window_handle = WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))
print("New window opened")

driver.implicitly_wait(5)
current_url = driver.current_url

# Realizar una solicitud HTTP para obtener el encabezado Content-Type
response = requests.head(current_url)
content_type = response.headers.get('Content-Type', '')

# Verificar si el Content-Type indica un PDF
if 'application/pdf' in content_type:
    print("La pestaña actual contiene un PDF.")
else:
    print("La pestaña actual no contiene un PDF.")