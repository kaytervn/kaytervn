from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import matplotlib.pyplot as plt

# Hệ phương trình
# 2x + y - 2z = 8
# 3x + 2y - 4z = 15
# 5x + 4y - z = 1

A = np.array([[2, 1, -2], [3, 2, -4], [5, 4, -1]])
b = np.array([8, 15, 1])

x = np.linalg.solve(A, b)

print(x)

# %%

# Hệ phương trình
# 2x + 2y - z + t = 4
# 4x + 3y - z + 2t = 6
# 8x + 5y - 3z + 4t = 12
# 3x + 3y - 2z + 2t = 6

A = np.array([[2, 2, -1, 1], [4, 3, -1, 2], [8, 5, -3, 4], [3, 3, -2, 2]])
b = np.array([4, 6, 12, 6])

x = np.linalg.solve(A, b)

print(x)

# %%


def drawGauss2D(mu, sigma):
    x = np.arange(-5, 10, 0.1)
    g = (1 / (sigma * np.sqrt(2 * np.pi))) * \
        np.exp(-((x - mu)**2) / (2 * sigma**2))
    plt.plot(
        x, g, '-', label='mu={mu}, sigma={sigma}'.format(mu=mu, sigma=sigma))


drawGauss2D(mu=0, sigma=1.2)
drawGauss2D(mu=0, sigma=3.14)
drawGauss2D(mu=5, sigma=1.2)
drawGauss2D(mu=5, sigma=3.14)

plt.title('Vẽ đồ thị trong Python với Matplotlib')
plt.xlabel('Trục X')
plt.ylabel('Trục Y')
plt.legend(loc='best')
plt.grid(visible=1)
plt.show()

# %%

A = 1
x0 = 0
y0 = 0

fig = plt.figure()


def drawF3D(sigX, sigY, ax):
    x = np.arange(-5, 5, 0.1)
    y = np.arange(-5, 5, 0.1)
    X, Y = np.meshgrid(x, y)

    f = A*np.exp(-(((X-x0)**2)/(2*sigX**2) + ((Y-y0)**2)/(2*sigY**2)))

    ax.set_title('sigX={}, sigY={}'.format(sigX, sigY))
    ax.plot_surface(X, Y, f, cmap='viridis')


drawF3D(sigX=1.2, sigY=1.2, ax=fig.add_subplot(2, 2, 1, projection='3d'))
drawF3D(sigX=1.2, sigY=3.14, ax=fig.add_subplot(2, 2, 2, projection='3d'))
drawF3D(sigX=3.14, sigY=1.2, ax=fig.add_subplot(2, 2, 3, projection='3d'))
drawF3D(sigX=3.14, sigY=3.14, ax=fig.add_subplot(2, 2, 4, projection='3d'))

plt.legend(loc='best')
plt.grid(visible=1)
plt.show()
