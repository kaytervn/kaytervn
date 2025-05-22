from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import matplotlib.pyplot as plt

x = np.array(range(-10, 10), dtype="float32")
plt.plot(x, x * np.random.random(20), "go--", label="Python")
plt.plot(x, x * np.random.random(20), "r^-", label="C#")
# plt.show()
plt.plot(x, x * np.random.random(20), "bv-", label="Java")
plt.title("Vẽ đồ thị trong Python với Matplotlib")
plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%


# Khởi tạo các biến
A = 1
x0 = 0
y0 = 0

# Tạo mảng dữ liệu
x = np.linspace(-10, 10, 30)
y = np.linspace(-10, 10, 30)
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# Vẽ biểu đồ 3D
fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

ax.plot_surface(X, Y, Z, cmap="viridis")

ax.set_title("Biểu đồ 3D của hàm f(x, y)")
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

plt.show()

# %%
x = np.array(range(-10, 10), dtype="float32")
plt.title("Vẽ đồ thị hàm số")
plt.plot(x, x**5, "go--", label="y = x^5")
plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%
x = np.array(range(-10, 10), dtype="float32")
plt.title("Vẽ đồ thị hàm số")
plt.plot(x, x**100, "r^-", label="y = x^100")
plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%
x = np.array(range(-10, 10), dtype="float32")
plt.title("Vẽ đồ thị hàm số")
plt.plot(x, (2 * x**2 + 4 * x - 5) ** 3, "bv-", label="y = (2*x^2 + 4*x - 5)^3")
plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%
x = np.array(range(-10, 10), dtype="float32")
plt.title("Vẽ đồ thị hàm số")
plt.plot(x, (x**2 + 2) ** (5 / 4), "yo-", label="y = (2*x^2 + 4*x - 5)^3")
plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%
x = np.arange(0, 2 * np.pi, np.pi / 180)
plt.title("Vẽ đồ thị hàm số")
plt.plot(
    x,
    1 + np.sin(2 * x) + np.cos(x) + np.sin(x),
    "go--",
    label="f1 = 1 + sin(2*x) + cos(x) + sin(x)",
)
plt.plot(x, 3 * np.sin(x) + 2 * np.cos(x), "r^-", label="f2 = 3*sin(x) + 2*cos(x)")
plt.plot(
    x,
    2 * (np.sin(x) + np.cos(x)) + 2 * np.sin(x) * np.cos(x) + 2,
    "bv-",
    label="f3 = 2*(sin(x) + cos(x)) + 2*sin(x)*cos(x) + 2",
)
plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%

x = np.arange(-5, 5)
y = np.arange(-5, 5)
X, Y = np.meshgrid(x, y)
Z = 5 * X / 4 + Y - 1

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

ax.plot_surface(X, Y, Z)
ax.set_title("Surface plot")
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

plt.show()

# %%

x = np.arange(-5, 5)
y = np.arange(-5, 5)
z = np.arange(-5, 5)
X, Y, Z = np.meshgrid(x, y, z)
T = 5 * X / 4 + Y - 1

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

ax.plot_surface(X, Y, Z)
ax.set_title("Surface plot")
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

plt.show()

# %%
# mu = 0
# sigma = 1.2
# x = np.array(range(-10, 10), dtype='float32')

# plt.title('Vẽ đồ thị hàm số Xác Suất')
# plt.plot(x, (1 / (sigma * math.sqrt(2 * math.pi))) * math.exp(-((x - mu)
#          ** 2) / (2 * sigma ** 2)), 'yo-', label='y = (2*x^2 + 4*x - 5)^3')

mu = 0
sigma = 1.2

x = np.arange(-10, 10, 0.1)

plt.title("Vẽ đồ thị hàm số Xác Suất")

plt.plot(
    x,
    (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-((x - mu) ** 2) / (2 * sigma**2)),
    "r-",
    label="Xác suất",
)

mi = 0
sig = 3.14
plt.plot(
    x,
    (1 / (sig * np.sqrt(2 * np.pi))) * np.e ** ((-((x - mi) ** 2)) / 2 * sig**2),
    "yo-",
    label="y = (2*x^2 + 4*x - 5)^3",
)

plt.xlabel("Trục X")
plt.ylabel("Trục Y")
plt.legend(loc="best")
plt.show()

# %%

# Định nghĩa hệ số của hệ phương trình
A = np.array([[2, 1, -2], [3, 2, 4], [5, 4, -1]])

b = np.array([8, 15, 1])

# Giải hệ phương trình
solution = np.linalg.solve(A, b)

x1, x2, x3 = solution

# Tạo dữ liệu cho đồ thị
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)
Z1 = (8 - 2 * X - Y) / (-2)
Z2 = (15 - 3 * X - 2 * Y) / 4
Z3 = (1 - 5 * X - 4 * Y) / (-1)

# Vẽ đồ thị 3D
fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")
ax.plot_surface(X, Y, Z1, alpha=0.5, rstride=100, cstride=100)
ax.plot_surface(X, Y, Z2, alpha=0.5, facecolors="g", rstride=100, cstride=100)
ax.plot_surface(X, Y, Z3, alpha=0.5, facecolors="r", rstride=100, cstride=100)

# Vẽ điểm của giải phương trình
ax.scatter(x1, x2, x3, color="k", marker="o", s=100, label="Solution")

plt.xlabel("X1")
plt.ylabel("X2")
ax.set_zlabel("X3")
plt.legend()
plt.show()

# %%

# Định nghĩa hệ số của hệ phương trình
A = np.array([[2, 2, -1, 1], [4, 3, -1, 2], [8, 5, -3, 4], [3, 3, -2, 2]])

b = np.array([4, 6, 12, 6])

# Giải hệ phương trình
solution = np.linalg.solve(A, b)

x1, x2, x3, x4 = solution

# Tạo dữ liệu cho đồ thị
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
z = np.linspace(-5, 5, 100)
X, Y, Z = np.meshgrid(x, y, z)
T1 = -2 * x - 2 * y + z + 4
T2 = (-4 * x - 3 * y + z + 6) / 2
T3 = (-8 * x - 5 * y + 3 * z + 12) / 4
T4 = (-3 * x - 3 * y + 2 * z + 6) / 2

# Vẽ đồ thị 3D
fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")
ax.plot_surface(X, Y, Z, T1, alpha=0.5, rstride=100, cstride=100)
ax.plot_surface(X, Y, Z, T2, alpha=0.5, facecolors="g", rstride=100, cstride=100)
ax.plot_surface(X, Y, Z, T3, alpha=0.5, facecolors="r", rstride=100, cstride=100)
ax.plot_surface(X, Y, Z, T4, alpha=0.5, facecolors="y", rstride=100, cstride=100)

# Vẽ điểm của giải phương trình
ax.scatter(x1, x2, x3, x4, color="k", marker="o", s=100, label="Solution")

plt.xlabel("X1")
plt.ylabel("X2")
plt.ylabel("X3")
ax.set_zlabel("X4")
plt.legend()
plt.show()

# %%

# Định nghĩa hàm số ba biến


def f(x, y, z):
    return x**2 + y**2 - z**2


# Tạo dữ liệu cho các biến x, y, z
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
x, y = np.meshgrid(x, y)
z = f(x, y, x + y)

# Tạo đối tượng subplot 3D
fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

# Vẽ đồ thị hàm số
ax.plot_surface(x, y, z, cmap="viridis")

# Đặt nhãn cho các trục
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

# Hiển thị đồ thị 3D
plt.show()

# %%

# Định nghĩa hàm số bốn biến


def f(x, y, z, w):
    return x**2 + y**2 - z**2 + w**2


# Tạo dữ liệu cho các biến x, y, z, w
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
z = np.linspace(-5, 5, 100)
w = np.linspace(-5, 5, 100)
x, y, z, w = np.meshgrid(x, y, z, w)
v = f(x, y, z, w)

# Tạo đối tượng subplot 3D
fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

# Vẽ đồ thị hàm số
ax.scatter(x, y, z, c=v, cmap="viridis")

# Đặt nhãn cho các trục
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

# Hiển thị đồ thị 3D
plt.show()

# %%

A = 1
x0 = 0
y0 = 0
sigX = 3.14
sigY = 3.14

x = np.arange(-5, 5, 0.1)
y = np.arange(-5, 5, 0.1)
X, Y = np.meshgrid(x, y)

f = A * np.exp(-(((X - x0) ** 2) / (2 * sigX**2) + ((Y - y0) ** 2) / (2 * sigY**2)))

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

ax.plot_surface(X, Y, f, cmap="viridis")

ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("f(x,y)")

plt.show()
