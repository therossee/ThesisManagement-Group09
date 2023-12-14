from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import PyPDF2

# Step 1: Go to the home page
driver = webdriver.Chrome()
driver.get("http://localhost:5173/")

# Step 2: Log in as a teacher
# Fill in the login form and submit
driver.implicitly_wait(5)
user_field = driver.find_element(By.XPATH, "//input[@id='username']")
user_field.send_keys("d255269@polito.it")
print("User inserted")

driver.implicitly_wait(5)
password_field = driver.find_element(By.XPATH, "//input[@id='password']")
password_field.send_keys("d255269")
print("Password inserted")

# Step 3: Click on 'Thesis Applications' in the left bar
thesis_applications_link = driver.find_element(By.LINK_TEXT, "Thesis Applications")
thesis_applications_link.click()

# Step 4: Click on a row of a student
student_row = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//table[@id='applicationsTable']/tbody/tr")))
student_row.click()

# Step 5: Click on "View attached pdf" button
view_pdf_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[text()='View attached pdf']")))
view_pdf_button.click()

# Step 6: Verify that the pdf file is visible
def read_pdf_file(file_path):
    # Open the file in binary read mode
    with open(file_path, 'rb') as file:
        # Create a PdfFileReader object
        pdf_reader = PyPDF2.PdfFileReader(file)
        # Get the number of pages in the PDF
        num_pages = pdf_reader.numPages
        # Initialize an empty string to store the text
        text = ""
        # Read each page and append its content to the text string
        for page_num in range(num_pages):
            page = pdf_reader.getPage(page_num)
            text += page.extractText()
    return text

# Use the function to read a PDF file
pdf_text = read_pdf_file(file_path)
print(pdf_text)

# Close the browser
driver.quit()
