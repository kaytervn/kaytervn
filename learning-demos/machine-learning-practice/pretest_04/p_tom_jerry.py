# Xác suất đã cho
P_B_given_A = 0.01  # P(Great Film | Includes Tom_Jerry)
P_B_given_Ac = 0.1  # P(Great Film | Tom_Jerry absent)
P_A = 0.01  # P(Tom_Jerry in a randomly chosen film)

# Tính P(A^c)
P_Ac = 1 - P_A

# Tính P(B) (Xác suất toàn phần)
P_B = P_B_given_A * P_A + P_B_given_Ac * P_Ac

# Tính P(B')
P_Bc = 1 - P_B

# Tính P(A ∩ B')
P_A_and_Bc = P_A - (P_B_given_A * P_A)

# Tính P(A | B') = P(A ∩ B') / P(B')
P_A_given_Bc = P_A_and_Bc / P_Bc

# Làm tròn đến 5 chữ số thập phân
P_A_given_Bc_rounded = round(P_A_given_Bc, 5)

# In kết quả
print(f"P(Tom_Jerry is in the film | Not a Great Film) = {P_A_given_Bc_rounded}")
