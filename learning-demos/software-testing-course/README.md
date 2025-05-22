### Specifications for the Simple Calculator Program

**1.** The program handles arithmetic operations for real numbers, including positive and negative numbers:
   - Real number `+`, `-`, `*`, `/` Real number (positive or negative).
   - Positive `+`, `-`, `*`, `/` Negative.

---

**2.** Supports calculations with large numbers, up to 30 digits.

---

**3.** The first and second input fields must not be empty or contain invalid characters. 
   - If violated, an error message appears when the field loses focus, prompting correction before proceeding.

---

**4.** When an input field gains focus, its entire content should be selected automatically to facilitate quick replacement.

---

**5.** Only **one operation** can be selected at a time.

---

**6.** After entering two valid numbers and selecting an operation:
   - Pressing the "Calculate" button displays the result in a read-only field.

---

**7.** For division:
   - If the divisor is `0`, the program shows an error message and focuses on the second input field for correction.

---

**8.** Upon pressing the "Exit" button:
   - A confirmation dialog asks if the user wants to quit. 
   - Exiting closes the program, while canceling returns to the program.
