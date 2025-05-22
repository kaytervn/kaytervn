**Install Python Library**

1. Open Command Prompt (CMD)
2. Navigate to the `Scripts` folder of your Python installation (Example: `cd C:\Users\...\AppData\Local\Programs\Python\Python311\Scripts`)
3. Install a module: `pip install <module-name>`

---

**Select Python Interpreter in VS Code:** Press `Ctrl + Shift + P`, then search and select "Python: Select Interpreter"

---

**Run a Python File via CMD/Terminal**

1. Go to the folder containing your `.py` file (Example: `cd D:\...\...`)
2. Run with default Python: `python hello.py`
3. Or run with a specific version: `C:\Users\...\Python311\python.exe hello.py`

---

**Python Setup Notes**

- Download Python (e.g., version 3.12.10)
- During installation, **check the box**: “Add Python to PATH”

---

**Run a FastAPI Project**

1. Install dependencies: `pip install -r requirements.txt`
2. Navigate to the folder with `main.py`
3. Start the server: `uvicorn main:app --reload`
