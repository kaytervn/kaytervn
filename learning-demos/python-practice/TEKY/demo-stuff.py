# %%
a = 0
while a < 100:
    b = c = 0
    while b < 100:
        print("* ", end="")
        b += 1
    while c < 100:
        print(" * ", end="")
        c += 1
    a += 1

# %%
c = 0
while c <= 100:
    a = 0
    while a <= 100:
        print("* ", end="")
        a += 1
    b = 0
    while b <= 100:
        print(" * ", end="")
        b += 1
    d = 0
    while d <= 100:
        print(" *", end="")
        d += 1
    c += 1

# %%

b = 0
while b < 7:
    a = 0
    while a < 7:
        print("*", end="")
        a += 1
    print()
    b += 1

# %%
a = 0
while a < 7:
    print("*" * a)
    a += 1

# %%
n = 0
while n < 10:
    print(n)
    n += 1
