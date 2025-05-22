from sympy import symbols, diff, Eq, solve

# Define variables
x, y, z, lambda1, lambda2 = symbols("x y z lambda1 lambda2")

# Define the functions
f = x**2 + 2 * y - z**2  # Objective function
g1 = 2 * x - y  # Constraint 1
g2 = y + z  # Constraint 2

# Lagrange function
L = f + lambda1 * g1 + lambda2 * g2

# Derivatives (partial derivatives of L)
L_x = diff(L, x)
L_y = diff(L, y)
L_z = diff(L, z)
L_lambda1 = g1
L_lambda2 = g2

# Solve the system of equations
equations = [
    Eq(L_x, 0),  # ∂L/∂x = 0
    Eq(L_y, 0),  # ∂L/∂y = 0
    Eq(L_z, 0),  # ∂L/∂z = 0
    Eq(L_lambda1, 0),  # g1 = 0
    Eq(L_lambda2, 0),  # g2 = 0
]

# Solve the equations
solution = solve(equations, (x, y, z, lambda1, lambda2), dict=True)

if solution:
    # Extract the first solution
    result = solution[0]
    x_val = float(result[x])
    y_val = float(result[y])
    z_val = float(result[z])

    # Print the result
    print(f"x = {x_val:.2f}, y = {y_val:.2f}, z = {z_val:.2f}")
else:
    print("No solution found.")
