import fitz  # PyMuPDF

# 1. Create a blank PDF document document matrix
doc = fitz.open()
page = doc.new_page()  # Standard dimensions page layout

# 2. Add our mock resume text profile details
resume_text = (
    "Karan Sharma \nSoftware Engineer | Delhi, India\n\n"
    "Skills: Python, Java, Machine Learning, Natural Language Processing, React, Node.js, SQL.\n\n"
    "Experience: Developed an AI-driven network anomaly detection pipeline using Scikit-Learn "
    "and custom Streamlit interfaces. Managed software dependencies and terminal environments in VS Code."
)

# 3. Write text onto the canvas element
page.insert_text((50, 50), resume_text, fontsize=12)

# 4. Save directly into your local directory execution space
doc.save("sample_resume.pdf")
print("✅ Success! 'sample_resume.pdf' has been generated inside ml-service.")