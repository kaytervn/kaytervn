# Face ID Service

## Description
The Face ID Service provides biometric authentication for secure user login, using OpenCV and FastAPI. It enhances security for the mobile application.

## Installation
1. **Prerequisites**:
   - Python 3.12.10
   - Visual Studio Code

2. **Setup**:
   - Clone the repository:  
     ```bash
     git clone https://github.com/ITZ-Developers/kltn-fm-be-faceid
     ```
   - Open the project in VS Code.
   - Install dependencies:  
     ```bash
     pip install -r requirements.txt
     ```
   - Navigate to the folder containing `main.py`.
   - Start the service:  
     ```bash
     uvicorn main:app --reload
     ```