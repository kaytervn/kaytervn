L = list(("app", "anna", "anh"))
print(type(L))
print(len(L))

# %%
print(L[-1])

# %%
# Slicing

L2 = [1, 2, 3, 4, 5, 6, 7]

print(L2[2:])

# %%
print(L2[:5])
print(L2[-3:1:-1])
if 2 in L2:
    print("Co 2 trong L2")
else:
    print("Khong co 2 trong L2")

# %%
# Change list

L = ["a", "b", "c"]
L[1:2] = ["ab", "dd", "cc"]
print(L)

# %% Extend List
L.insert(2, "b1")
print(L)

thislist = [1, 2, 3, 4]
tropical = [5, 6, 7, 8, 9]
thislist.extend(tropical)
print(thislist)

# %%
# thislist.remove(2)
thislist.pop(1)
thislist.clear()
print(thislist)

# %%
thislist = ["Apple", "Banana", "Watermelon", "Pineapple"]
for x in thislist:
    print(x)

# %% List Comprehension
thislist = ["Apple", "Banana", "Watermelon", "Pineapple"]
[print(x) for x in thislist]

newlist = []
for x in thislist:
    if "a" in x:
        newlist.append(x)

print(newlist)
# %%
thislist = ["Apple", "Banana", "Watermelon", "Pineapple"]
newlist = [x for x in thislist if "a" in x]
print(newlist)

newlist2 = [x for x in range(10)]
print(newlist2)

# %%
fruits = ["apple", "banana", "kiwi", "Pineapple", "orange", "mango"]

newlist = [x for x in fruits]
print(newlist)
newlist = [x for x in range(10)]
print(newlist)
newlist = [x for x in range(10) if x < 5]
print(newlist)
newlist = [x.upper() for x in fruits]
print(newlist)
newlist = ["hello" for x in fruits]
print(newlist)

newlist = [x if x != "banana" else "orange" for x in fruits]
print(newlist)
# %%
fruits.sort(reverse=True)
print(fruits)

# %% Join two list

l1 = ["a", "b", "c"]
l2 = [1, 2, 3]
l3 = l1 + l2
print(l3)

for x in l2:
    l1.append(x)

print(l1)

# %%
L = [
    1,
    2,
    3,
    4,
    5,
    6,
    6,
    34,
    34,
    34,
    54,
    34,
    1,
    23,
    4,
    23,
    54,
    4,
    5,
    6,
    5,
    3,
    4,
    7,
    4,
    4,
    8,
    3,
    5,
    6,
    8,
    85,
]

print("\tRating\t\t\tFrequency")
for i in range(1, 11):
    print("%6d %13d" % (i, L.count(i)))

# %% Print Asterists
values = []
for i in range(3):
    newVal = int(input("Enter interger %d: " % (i + 1)))
    values += [newVal]
print("%s %10s %10s" % ("Element", "Value", "Asterists"))
for i in range(len(values)):
    print("%7d %10d %s" % (i, values[i], "*" * values[i]))

# %% Story Names
print("Enter your 5 favorite story names")
L = []
for i in range(5):
    x = input("story %d: " % (i + 1))
    L.append(x)
print("\nSubscript Value")
for i in range(len(L)):
    print("%9d %-25s" % (i + 1, L[i]))

# %%
for x in "banana":
    print(x)
txt = "The books are free!"
print("free" in txt)

if "free" in txt:
    print("Yes, 'free' is present.")

# Slicing
b = "Hello World!"
print(b[2:5])
print(b[:5])
print(b[2:])

# %%
age = 26
txt = "My name is Paul, I am {1} {0}"
print(txt.format(age, "123e"))

# %%

L = [1, 2, 3, 4, 5, 6]
max2 = L[0]
for i in range(len(L)):
    if L[i] > max2 and L[i] < max(L):
        max2 = L[i]
print(max2)
# %%
h = int(input("h: "))
for i in range(h):
    print("*" * (h - i))

# %%
i = 24
while True:
    if i % 0o11 == 0:
        break
    print(i, end="")
    i -= 3

# %%
# Tuples
t = ("apple",)
print(type(t))

# %%
thistuple = ("apple", "banana", "cherry", "orange", "kiwi")
print(thistuple)
print(thistuple[-1])
print(type(thistuple))
# %%

thistuple = ("apple", "banana", "cherry")
y = list(thistuple)
y.append("orange")
thistuple = tuple(y)

z = ("orange",)
thistuple += z
print(thistuple)

# %%
# Unpacking a tuple
fruits = ("apple", "banana", "cherry")
(green, yellow, red) = fruits

print(green)
print(yellow)
print(red)

# %%
# Using Asterisk
fruits = ("apple", "banana", "cherry", "avocado", "raspberry")
(green, yellow, *red) = fruits

print(green)
print(yellow)
print(red)

# %%
fruits = ("apple", "banana", "cherry", "avocado", "raspberry")
(green, *tropic, red) = fruits

print(green)
print(tropic)
print(red)
# %%
fruits = ("apple", "banana", "cherry", "avocado", "raspberry")
for x in fruits:
    print(x)
for i in range(len(thistuple)):
    print(thistuple[i])
i = 0
while i < len(thistuple):
    print(thistuple[i])
    i += 1
# %%
tuple1 = ("a", "b", "c")
tuple2 = (1, 2, 3)
tuple3 = tuple1 + tuple2
print(tuple3)

# %%
fruits = ("apple", "banana", "cherry", "avocado", "raspberry")
mytuple = fruits * 2
print(mytuple)
print(mytuple.count("apple"))
print(mytuple.index("apple"))


# %%
def func(fname):
    print(fname + " Nguyen")


func("LE")
# %%


def my_func(*kids):
    print("The youngest child is " + kids[2])


my_func("Nam", "Lan", "Trung")


# %%
def my_func(child3, child2, child1):
    print("The youngest child is " + child3)


my_func(child1="Nam", child2="Lan", child3="Trung")


# %%
def my_func(**kid):
    print("His last name is " + kid["lname"])


my_func(fname="Le", lname="Nguyen")


# %%
def my_func(country="Viet Nam"):
    print("Im from " + country)


my_func("The UK")
my_func()


# %%
def my_func(food):
    for x in food:
        print(x)


fruits = ["apple", "banana", "cherry"]
my_func(fruits)


# %%
def my_func(x):
    return 2 * x


print(my_func(4))
print(my_func(3))
print(my_func(6))

# %%
# The pass stament


def my_func(x):
    pass


my_func(5)
# %%
# Recursion


def tri_recursion(k):
    if k > 0:
        result = k + tri_recursion(k - 1)
        print(result)
    else:
        result = 0
    return result


print("Recursion Example Results:")
tri_recursion(6)

# %%
# Lambda function
# Thêm 10 đối số a và trả về kết quả:
x = lambda a: a + 10
print(x(5))

# %%
# Nhân đối số a với đối số b và trả về kết quả:
x = lambda a, b: a * b
print(x(5, 6))

# %%
# Using Lambda Function


def myfunc(n):
    return lambda a: a * n


mydoubler = myfunc(2)
print(mydoubler(7))

# %%
n = 153
s = n
b = len(str(n))
s1 = 0
while n != 0:
    r = n % 10
    s1 = s1 + (r**b)
    n //= 10
if s == s1:
    print("The given number", s, "is armstrong number")
else:
    print("The given number", s, "is not armstrong number")


# %%
def armstro(num):
    num_str = str(num)
    n = len(num_str)
    sum = 0
    for d in num_str:
        sum += int(d) ** n
    if sum == num:
        return True
    else:
        return False


num = 153
print(armstro(num))


# %%
def armstr_num(num):
    return sum(int(d) ** len(str(num)) for d in str(num)) == num


num = 153
if armstr_num(num):
    print(f"{num} is an Armstrong number")
else:
    print(f"{num} is not an Armstrong number")

# %%
num = 11
if num > 1:
    for i in range(2, int(num / 2) + 1):
        if (num % i) == 0:
            print(num, "is not a prime number")
            break
        else:
            print(num, "is a prime number")
else:
    print(num, "is not a prime number")

# %%
c = "g"
# print the ASCII value of assigned character in c
print("The ASCII value of '" + c + "' is", ord(c))

# %%
# WEEK 9
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr)
print(type(arr))

# %%
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.ndim)
# %%
arr = np.array([1, 2, 3, 4], ndmin=5)

arr = np.array([[1, 2, 3], [4, 5, 6]])
print("2nd element on 1st row:", arr[0, 1])
print("3th element on 2nd row:", arr[0, 2])

# %%
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Last element from 2nd dim: ", arr[1, -1])

# %%
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(arr[1:5])
print(arr[4:])
print(arr[:4])
print(arr[-3:-1])
print(arr[1:5:2])
print(arr[::2])

# %%
arr = np.array([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]])
print(arr[1, 1:4])
print(arr[0:2, 2])
print(arr[0:2, 1:4])
print(arr.dtype)
# %%
arr = np.array([1, 2, 3, 4, 5], dtype="S")
print(arr)
print(arr.dtype)
# %%
arr = np.array([1.1, 2.1, 3.1])
newarr = arr.astype("i")
print(newarr)
print(newarr.dtype)

# %%
arr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
newarr = arr.astype(bool)
print(newarr)
print(newarr.dtype)

# %%
# Tạo vùng nhớ mới
arr = np.array([1, 2, 3, 4, 5])
x = arr.copy()
arr[0] = 42
print(arr)
print(x)

# %%
# Truy xuất tới vùng nhớ đó
arr = np.array([1, 2, 3, 4, 5])
x = arr.view()
arr[0] = 42

print(arr)
print(x)
# %%
arr = np.array([1, 2, 3, 4, 5])
x = arr.copy()
y = arr.view()

print(x.base)
print(y.base)
# %%
arr = np.array([1, 2, 3, 4, 5], ndmin=5)
print(arr)
print("shape of array: ", arr.shape)

# %%
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
x = arr.reshape(4, 3)
print(x)

# %%
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])
x = arr.reshape(3, 3)
print(x)
# %%
# '-1' Tự điều chỉnh Shape
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8])
newarr = arr.reshape(2, 2, -1)
print(newarr)
# %%
arr = np.array([[1, 2, 3], [4, 5, 6]])
newarr = arr.reshape(-1)
print(newarr)
# %%
# Duyệt mảng
arr = np.array([1, 2, 3])
for x in arr:
    print(x)
# %%
arr = np.array([[1, 2, 3], [4, 5, 6]])
for x in arr:
    print(x)

# In phần tử
for x in arr:
    for y in x:
        print(y)

# %%
# In phần tử
arr = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])
for x in np.nditer(arr):
    print(x)

# %%
arr = np.array([[1, 2, 3, 4], [5, 6, 7, 8]])

for x in np.nditer(arr[:, ::2]):
    print(x)
# %%
arr = np.array([1, 2, 3])
for idx, x in np.ndenumerate(arr):
    print(idx, x)
# %%
arr = np.array([[1, 2, 3, 4], [5, 6, 7, 8]])
for idx, x in np.ndenumerate(arr):
    print(idx, x)
# %%
# Nối mảng
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])
arr = np.concatenate((arr1, arr2))
print(arr)
# %%
arr1 = np.array([[1, 2], [3, 4]])
arr2 = np.array([[5, 6], [7, 8]])

# Nối mảng theo cột
arr = np.concatenate((arr1, arr2), axis=0)
print(arr)

# Nối mảng theo dòng
arr = np.concatenate((arr1, arr2), axis=1)
print(arr)

# Mặc định theo cột
arr = np.concatenate((arr1, arr2))
print(arr)

# %%
arr = np.array(
    [[1, 2, 3], [3, 4, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15], [16, 17, 18]]
)
newarr = np.hsplit(arr, 3)
print(newarr)
# %%
arr = np.array([1, 2, 3, 4, 5, 4, 4])
# Trả về vị trí của cả ba phần tử '4'
x = np.where(arr == 4)
print(x)
# %%
arr = np.array([1, 2, 3, 4, 5, 4, 4])
# Trả về vị trí của cả ba phần tử '4'
x = np.where(arr % 2 == 0)
print(x)
# %%
arr = np.array([6, 7, 8, 9, 10])
x = np.searchsorted(arr, 7, side="right")
print(x)
# %%
# [LỌC] Lấy những giá trị có vị trí ở [x] là True
arr = np.array([41, 42, 43, 44])
x = [True, False, True, False]
newarr = arr[x]
print(newarr)
# %%
# Lọc những giá trị lớn hơn 42
arr = np.array([41, 42, 43, 44])
# Tạo mảng Lọc
filer_arr = []
for i in arr:
    if i > 42:
        filer_arr.append(True)
    else:
        filer_arr.append(False)

newarr = arr[filer_arr]
print(filer_arr)
print(newarr)
# %%
# Lọc những giá trị lớn hơn 42
arr = np.array([41, 42, 43, 44])
# Tạo mảng Lọc
filer_arr = arr > 42
newarr = arr[filer_arr]
print(filer_arr)
print(newarr)
# %%
a = (2, 3, 4)
print(sum(a, 3))

# %%
a = (1, 2(4, 5))
a = (1, 2(3, 4))
print(a < b)
# %%

num = [i**+1 for i in range(3)]
print(num)
# %%
a = [15, 27, 6, [42]]
b = list(a)
a[3][0] = 34
a[1] = 18
print(b)
# %%
a = [(2, 4), (1, 2), (3, 9)]
a.sort()
a
# %%
L = list([1, 2, 3, 4])
L.append(5)
print(L)
# %%

print('\x 1ythony')
# %%

l=list('DATAANA') 
p=l[0], l[-1], l[1:3] 
print('a={0}, b={1}, c={2}'.format(*p))

# %%
X = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] 
print([X[i][i] for i in range(len(X))])
# %%
my_tuple = (1,2,3,4)
my_tuple.append((5,6,7))
print (len(my_tuple))
# %%
L=[[1,2, 3], [4, 5, 6], [7, 8, 9]] 
print([[row[i] for row in L] for i in range(3)])
# %%
mylist= [[1,2],[3,4]] 
print(sum(mylist, []))
# %%
hex(255), int('FF', 16), 0xFF
# %%
x= [[]]*3
x[1].append(7) 
print(x)
# %%
lst = [132, 657, 918, 345]
for numb in lst:
    dig_sum = 0
    while numb > 0:
        dig_sum=dig_sum + numb%10
        numb//=10
    print(dig_sum, end=' ')
# %%
yourList = [12,34,76,31,40]

yourval1 = 40

yourva12 = 12

yourList.insert(0,yourval1) 

yourList.append(yourva12)

print(yourList)
# %%
L1 = [1, 2, 3, 4]
L2 = L1
L3 = L1.copy()
L4 = L3
L1[0] = [5]
print (L1, L4)
# %%
str = input("Enter s string: ")
f=0
r = ''.join(reversed(str))
if str==r:
    f = 1
if f==1:
    print("Yes")
else:
    print("No")
# %%
for i in range(3):
    for j in range(3):
        print(((5)*(i+j)*(i+j)),end=' ')
    print()
# %%
yourList = [12,34,76,31,40]
size = len(yourList)
(yourList[0], yourList[size-1]) = (yourList[-1], yourList[0]) 
print(yourList)
# %%
yourList = [12, 34, 76, 31, 40]
(yourval1, *yourval2, yourval3) = yourList
yourList = [yourval3, *yourval2, yourval1]
print(yourList)
# %%
L1 = [1, 1.33, 'GFG', 0, 'NO', None, 'G', True]
val1, val2 = 0,'NO'
for x in L1:
    if(type(x) == int or type(x) == float): 
        val1 += x
    elif (type(x) == str): 
        val2 += x
print(val1+3,"GFGNO")
# %%
Danhsach =[1, 2, 3, 4, 5] 
Danhsach =Danhsach[-1:-1]
print(Danhsach)
# %%
lst = [x**2 for x in range(1,10)]
print(lst)

#%%
test_tup = (15, 20, 33, 17, 6, 8)
print("The original tuple is :", test_tup)
K = 2
test_tup = list(test_tup)
temp = sorted(test_tup)
res = tuple(temp[:K] + temp[-K:])
print("The extracted values are :", res)
# %%
yourList = [12,34,76,31,40]
size= len(yourList)
yourElement = yourList[0]
yourList[0]= yourList[size - 1]
yourList[size - 1] = yourElement
print(yourList)
# %%
L1 = [] 
L1.append([1, [2, 3], 4]) 
L1.extend([7, 8, 9]) 
print(L1[2])
print(L1[0][1][1])

# %%
string = '\x\1thon'  # Chuỗi "\x50\x79" tương đương với chuỗi "Py"
print(string)  # Output: Py

# %%
# Sets
# A set is unordered, unchageable and unindexed

thisset={"apple", "banana", "cherry", "apple"} # Không trùng lặp
print(thisset)
# %%
# True bằng 1 => Chỉ nhận True, không nhận 1
# Ngược lại False là 0
thisset={"apple", "banana", "cherry", True, 1,2} # Không trùng lặp
thisset={"apple", "banana", "cherry", True, False, 0} # Không trùng lặp

print(thisset)
print(len(thisset))

# %%

set1 = {"apple", "banana", "cherry"}
set2={1,2,3,4,5,3}
set3= {True, False, False}
set4={"abc", 34, True, 40, "female"}
print(type(set1))
print(type(set2))
print(type(set3))
print(type(set4))
# %%
thisset = set(("apple", "banana", "cherry"))
print(thisset)

# %%

thisset = {"apple", "banana", "cherry"}
for x in thisset:
    print(x)
print("banana" in thisset)

# %%
thisset = {"apple", "banana", "cherry"}
thisset.add("orange")
tropical = {"pineapple","mango"}

mylist=["kiwi", "lime"]

thisset.update(tropical)
thisset.update(mylist)

thisset.discard("banana")
thisset.remove("lime")
x = thisset.pop()

print(thisset)
print(x)
# %%
thisset = {"apple", "banana", "cherry"}
thisset.clear()
print(thisset)
# %%
thisset = {"apple", "banana", "cherry"}
del thisset
print(thisset)

#%%
set1={"a","b","c"}
set2={1,2,3}
set3=set1.union(set2)

print(set3)
# %%
x={"apple","banana","cherry"}
y={"google", "microsoft", "apple"}
x.intersection_update(y)

print(x)
# %%
x={"apple","banana","cherry"}
y={"google", "microsoft", "apple"}
z=x.intersection(y)

print(z)
# %%
x={"apple","banana","cherry"}
y={"google", "microsoft", "apple"}

z=x.symmetric_difference(y)
x.symmetric_difference_update(y)

print(x)
print(z)
# %%

#Dictionary
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
print(thisdict["brand"])
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964, "color":["red","blue","white"]}
print(type(thisdict))
print(len(thisdict))

# %%
thisdict=dict(name = "john", age=36, country="Norway")
print(thisdict)
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}

x= thisdict["model"]
x= thisdict.get["model"]
#%%
car= {"brand": "Ford", "model":"Mustang", "year":1964}
x=car.keys()
print(x)
car["year"]=2020
print(x)
# %%
car= {"brand": "Ford", "model":"Mustang", "year":1964}
x=car.values()
print(x)
car["year"]=2020
print(x)
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
if "model" in thisdict:
    print("'model' là một key trong từ điển")
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
thisdict["year"]=2018#Alter
thisdict["color"]="red"#Insert
print(thisdict)
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
thisdict.update({"year":2020})
thisdict.update({"color":"red"})
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
thisdict.pop("model")
del thisdict["year"]
print(thisdict)
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
thisdict.clear()
print(thisdict)

del thisdict

# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
for x in thisdict:
    print(x)
# %%
thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
for x in thisdict:
    print(thisdict[x])
# %%

thisdict= {"brand": "Ford", "model":"Mustang", "year":1964}
mydict = thisdict.copy()
print(mydict)

#%%
# Tạo một nested dictionary
nested_dict = {
    "person1": {
        "name": "Alice",
        "age": 30,
        "address": {
            "city": "New York",
            "zipcode": "10001"
        }
    },
    "person2": {
        "name": "Bob",
        "age": 25,
        "address": {
            "city": "San Francisco",
            "zipcode": "94102"
        }
    }
}

print(nested_dict["person1"]["name"])  # Output: "Alice"
print(nested_dict["person2"]["address"]["city"])  # Output: "San Francisco"

nested_dict["person1"]["age"] = 35
nested_dict["person2"]["address"]["zipcode"] = "94103"

print(nested_dict)

#%%
class MyClass:
    x=5

p1 = MyClass()
print(p1.x)

# %%
class Person:
    def __init__(self, name, age):
        self.name=name
        self.age=age

    def __str__(self):
        return f"{self.name}({self.age})"

p1 = Person("John",36)
print(p1.name)
print(p1.age)
print(p1)

# %%
input_string = input("Starting Board:\n")
input_list = input_string.split()  # Tách chuỗi thành danh sách các phần tử
starting_board = [int(num) for num in input_list]  # Chuyển đổi các phần tử thành số nguyên
# %%

# Ufuncs
# ndarray
x=[1,2,3,4]
y=[4,5,6,7]
z=[]

for i,j in zip(x,y):
    z.append(i+j)
print(z)
# %%
import numpy as np
def myadd(x,y):
    return x+y

ma = np.frompyfunc(myadd,2,1)
print(ma([1,2,3,4],[5,6,7,8]))
# %%
print(type(np.add))
# %%
print(type(np.concatenate))

# %%
print(type(np.khongcoham))

# %%
if type(np.add) == np.ufunc:
    print('add is ufunc')
else:
    print('add is not ufunc')
# %%
arr1 = np.array([1,2,3,4,5,6])
arr2 = np.array([7,8,9,10,11,12])

newarr = np.add(arr1,arr2)
print(newarr)
newarr = np.subtract(arr1,arr2)
print(newarr)
newarr = np.multiply(arr1,arr2)
print(newarr)
# %%
arr1 = np.array([10,20,30,40,50,60])
arr2 = np.array([3,5,10,8,2,33])
newarr = np.divide(arr1,arr2)
print(newarr)
# %%
arr1=np.array([10,20,30])
arr2=np.array([3,5,6])
newarr=np.power(arr1,arr2)
print(newarr)
# %%
# Chia lấy số dư
arr1 = np.array([10,20,30,40,50,60])
arr2 = np.array([3,5,10,8,2,33])
newarr = np.mod(arr1,arr2)
newarr = np.remainder(arr1,arr2)
print(newarr)
# %%
# Chia lấy nguyên
arr1 = np.array([10,20,30,40,50,60])
arr2 = np.array([3,5,10,8,2,33])
newarr = np.divmod(arr1,arr2)
# Output ra 2 mảng, thương nguyên và số dư
print(newarr)
# %%
arr = np.array([-1,-2,-3,-4,2,3])
newarr=np.absolute(arr)
# newarr = np.abs(arr)
print(newarr)
# %%
# Rounding Decimals
# Cắt bỏ phần thập phân
arr = np.trunc([-3.1666,3.6667])
print(arr)
arr = np.fix([-3.1666,3.6667])
print(arr)
# Làm tròn đến số thập phân thứ n
arr = np.around(-3.16662,2)
print(arr)
# Làm tròn đến số nguyên NHỎ hơn có giá trị gần nhất
arr = np.floor([-3.1666,3.6667])
print(arr)
# Làm tròn đến số nguyên LỚN hơn có giá trị gần nhất
arr = np.ceil([-3.1666,3.6667])
print(arr)

# %%
import numpy as np
arr = np.arange(1,10)
print(np.log2(arr))
print(np.log10(arr))
print(np.log(arr)) # log theo cơ số e

# %%
from math import log
import numpy as np

nplog = np.frompyfunc(log,2,1)
print(nplog(100,15))
# %%
arr1=np.array([1,2,3])
arr2=np.array([1,2,3])
newarr = np.sum([arr1,arr2])
print(newarr)
# %%
arr1=np.array([1,4,2])
arr2=np.array([1,2,3])
newarr = np.sum([arr1,arr2], axis=1)
print(newarr)
# %%
# Cummulative Sum: Tổng tích lũy
arr=np.array([1,2,3])
newarr=np.cumsum(arr)
print(newarr)
# %%
arr1=np.array([1,2,3,4])
arr2=np.array([5,6,7,8])

x=np.prod(arr1) # 24
print(x)
x=np.prod([arr1,arr2]) # 40320
print(x)
newarr = np.prod([arr1,arr2],axis=1)
print(newarr)
newarr = np.cumprod(arr2)
print(newarr)
# %%
# Differences
arr = np.array([10,15,25,5])
newarr = np.diff(arr)
print(newarr)
newarr = np.diff(arr, n=2)
print(newarr)

# %%
# Bội số chung nhỏ nhất (Lowest Common Mutltiple)
num1=4
num2=6
x=np.lcm(num1,num2)
print(x)
# %%
arr = np.array([3,6,9])
x= np.lcm.reduce(arr)
print(x)

# %%
# Ước số chung lớn nhất (Greatest Common Denominator)
num1=4
num2=6
x=np.gcd(num1,num2)
print(x)
# %%
arr = np.array([3,6,9])
x= np.gcd.reduce(arr)
print(x)
# %%
x= np.sin(np.pi/2)
print(x)
# %%
arr = np.array([np.pi/2, np.pi/3,np.pi/4,np.pi/5])
x=np.sin(arr)
print(x)
# %%
arr = np.array([90,180,270,360])
x = np.deg2rad(arr)
print(x)
# %%
arr = np.array([np.pi/2, np.pi/3,np.pi/4,np.pi/5])
x = np.rad2deg(arr)
print(x)
# %%
# Finding Angles

x = np.arcsin(1.0)
print(x)
# %%
arr = np.array([1,-1,0.1])
x = np.arcsin(arr)
print(x)
# %%
x =np.sinh(np.pi/2)
print(x)
arr = np.array([np.pi/2, np.pi/3,np.pi/4,np.pi/5])
x= np.cosh(arr)
print(x)
x=np.arcsinh(1.0)
print(x)
arr=np.array([0.1,0.2,0.5])
x=np.arctanh(arr)
print(x)

# %%
arr = np.array([1,1,1,2,3,4,5,5,6,6,7])
x=np.unique(arr)
print(x)

# %%
set1=np.array([1,2,3,4])
set2=np.array([3,4,5,6])
newarr = np.union1d(set1,set2)
print(newarr)
# assume_unique=True tăng tốc độ tính toán
# lược bỏ các phần tử trùng lắp
newarr = np.intersect1d(set1,set2, assume_unique=True)
print(newarr)
newarr = np.setdiff1d(set1,set2, assume_unique=True)
print(newarr)
newarr = np.setxor1d(set1,set2, assume_unique=True)
print(newarr)

# %%
# Visualizing Data
import matplotlib.pyplot as plt
xpoints = np.array([0,6])
ypoints = np.array([0,250])
plt.plot(xpoints, ypoints)
plt.show()

# %%
xpoints = np.array([1,8])
ypoints = np.array([3,10])
plt.plot(xpoints, ypoints,'o')
plt.show()

# %%
ypoints = np.array([3,8,1,10,5,7])
plt.plot(ypoints)
plt.show()
# %%
ypoints = np.array([3,8,1,10,5,7])
plt.plot(ypoints, marker = ',')
plt.show()
# %%
years=[1950,1960,1970,1980,1990,2000,2010]
gdp = [3002,543.3,1075.9,2865.5,5979.6,10289.7,14958.3]

plt.title("Normal GDP")
plt.ylabel("Billions of $")

plt.show(plt.plot(years,gdp,color="green",marker="o",linestyle="solid"))
# %%
variance=[1,2,4,8,16,32,64,128,256]
bias_squared=[256,128,64,32,16,8,4,2,1]
total_error=[x+y for x,y in zip(variance,bias_squared)]
xs = [i for i,_ in enumerate(variance)]
plt.xlabel("model complexity")
plt.title("The Bias-Variance Tradeoff")
plt.show(plt.plot(xs,variance,"g-",label='variance'))
plt.show(plt.plot(xs,bias_squared,"r-.",label='bias^2'))
plt.show(plt.plot(xs,total_error,"b:",label='total error'))


# %%
movies=["Annie Hall", "Ben-Hur", "Casablanca", "Gandhi", "West Side Story"]
num_oscars = [5,11,3,8,10]
xs = [i for i,_ in enumerate(movies)]
plt.ylabel('# of Academy Awards')
plt.title("My favorite Movies")

plt.xticks([i for i,_ in enumerate(movies)],movies)
plt.show(plt.bar(xs,num_oscars))
# %%
friends = [70,65,72,63,71,64,60,64,67]
minutes = [175,170,205,120,220,130,105,145,190]
labels= ['a','b','c','d','e','f','g','h','i']
for label,friend_count,minute_count in zip(labels, friends,minutes):
    plt.annotate(label,xy=(friend_count,minute_count),xytext=(5,-5),textcoords='offset points')
plt.title("Daily Minutes vs. Number of Friends")
plt.xlabel("# of friends")
plt.ylabel("daily minutes spent on the site")
plt.show(plt.scatter(friends, minutes))
# %%
f = (lambda x, y: x if x < y else y)
print(f(101*98, 102*99))
# %%
import numpy as np
x = np.arange(1,6)
print(x)
# %%
x = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])
# Chi so co the âm
print(x[np.array([1, 3, -3])])
# %%
M = np.array([[6, 1, 1],
                      [4, -2, 5],
                      [2, 8, 7]])
print(np.linalg.matrix_power(M,2))
# %%
x = 12
def f1():
    global x
    x = 4
def f2(a,b):
    return a+b*x
f1()
h = f2(1,~2)
print(h)

# %%
import numpy as np
a = np.array([[1,2,3,4,5], [6,7,8,9,10]])
print('Phần tử thứ hai trên dòng thứ nhất: ', a[0][1])

# %%
import numpy as np
x = np.array([8,6])
y = np.array([4,5])
print(x+y)
# %%
x = np.array([[1, 1], [2, 3]])
print(np.unique(x))
# %%
print(np.all([10, 20, 0, -50]), np.all([10, 20, -50]))
# %%
import numpy as np
m = np.array([48,36,12,20,28])
print(m*3)

# %%
def example(L):
    i = 0
    result = []
    while i < len(L):
        result.append(L[1])
        i = i +3
    return result
# %%
import numpy as np
m = np.array([48,36,22,20,28])
print(m+5)
# %%
m = np.array([10, 40, 80, 50, 100])
# Chỉ số bằng biểu thức kiểu boolean
print(m[m>50])
# %%
import numpy as np
x = np.array([[2, 11, 7], [4, 3, 5]])
y = x.min()
print(y)
# %%
x = [1, 2, 8]
x = np.append(x, [[4, 5, 9], [7, 3, 6]])
print(x)

# %%
M = np.array([[6, 1, 1],
                      [4, -2, 5],
                      [2, 8, 7]])
print(np.linalg.det(M))
# %%
def f(a,b,c,d):
    print(a+d)
x = [1,2,3,4]
f(*x)
# %%
x = 12
def f1():
    x = 4
def f2(a,b):
    return a+b+x
f1()
h = f2(1,~2)
print(h)

# %%
print(np.bitwise_and(10,11))
# %%
import numpy as np
x = np.array([[2, 11, 7], [4, 3, 18]])
y = x.max()
print(y)
# %%
import numpy as np
x = np.array([1,2,3])
y = np.array([4,5,6])
z = x+y
print(z)
# %%
x = np.arange(100,200,10)
yzx = x.reshape(5,2)
print(yzx)
# %%
def your_show(**kwargs):
    for i in kwargs:
        print(i,end=' ')
your_show(LamAnh="Lam Anh",Tralời=5000000)
# %%
import numpy as np
arr1 = np.arange(3)
arr2 = np.arange(3,7)
arr3 = np.arange(7,10)
arr_2d = np.concatenate([arr1, arr2, arr3])
print(arr_2d)

# %%
M = np.array([[6, 1, 1],
                      [4, -2, 5],
                      [2, 8, 7]])
print(np.trace(M))

# %%
#phep toan nhi phan
print(np.bitwise_or([2, 8],[3, 3]))
# %%
import numpy as np
x = np.arange(1,6)
print(x)
# %%
yourArray = np.arange(10, 34, 1)
yourArray = yourArray.reshape(8,3)
x = np.split(yourArray,4,axis=0)
 
print(x)
# %%
import numpy as np
x = np.array([7,2,3])
y = np.array([4,5,6])
z = x*y
print(z)
# %%
x = np.array([7, 10, 20, 40, 60])
y = [7, 30, 10]
print(np.intersect1d(x, y))
# %%
x = np.array([0,1,2,4,6,8])
y = [1,3,4,5,7]
print(np.setdiff1d(x,y))
# %%
x = np.array([0, 10, 20, 40, 60])
y = [0, 40]
print(np.in1d(x, y))
# %%
import numpy as np
x = np.array([[2, 1, 0], [4, 3, 5]])
y = x.sum()
print(y)
# %%
import numpy as np
x = np.array([1,2,3,4])
print(x[2]+x[3])
# %%
import numpy as np
m = np.array([48,36,22,20,28])
print(m/2)
# %%
import numpy as np
x = np.array([7,2,3])
y = np.array([4,5,6])
z = x-y
print(z)
# %%
import numpy as np
x = np.zeros((2,3))
print(x)
# %%
m = np.array([10, 40, 80, 50, 100])
# Chỉ số bằng biểu thức kiểu boolean
print(m[m>50])
# %%
x = np.array([1,2,3], dtype=np.float64)
print(x.size, x.itemsize, x.nbytes)
# %%
M = np.array([[6, 1, 1],
                      [4, -2, 5],
                      [2, 8, 7]])
print(np.linalg.det(M))
# %%
print(np.all([10, 20, 0, -50]), np.all([10, 20, -50]))
# %%
x = [1, 2, 8]
x = np.append(x, [[4, 5, 9], [7, 3, 6]])
print(x)
# %%
import numpy as np
y = np.ones((2,3),dtype=np.int16)
print(y)
# %%
# Tính tổng các phần tử của list
def sumlist(a,low,high):
    if low == high:
        return a[low]
    m = (low + high) // 2
    l = sumlist(a,low,m)
    r = sumlist(a, m + 1, high)
    return l+r

L = [5, 22, 13, 9]
print(sumlist(L,0,len(L)-1)) # Output: 49
# %%
import numpy as np
x = np.array([[2, 11, 7], [4, 3, 5]])
y = x.min()
print(y)
# %%
from collections import Counter

L = [17, 3, 4, 25]

c = Counter(L)

s = 0
for a, b in c.items():
  s += a * b

print("Tổng của list là", s)
# %%
print(np.any([10, 20, 0, -50]), np.any([10, 20, -50]))
# %%
x = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])
# Chi so co the âm
print(x[np.array([1, 3, -3])])
# %%
# Xoay mảng sang trái d phần tử
def xoaytrai(a,n,d):
    t = []
    i = 0
    while (i < d):
        t.append(a[i])
        i = i + 1
    i = 0
    while (d < n):
        a[i] = a[d]
        i = i + 1
        d = d + 1
    a[:] = a[:i] + t
    return a
 
L = [11,22,33,44,55,66]
print(xoaytrai(L,len(L),2)) # output: [33, 44, 55, 66, 11, 22]
# %%
import numpy as np
yourArray = np.array([[12 ,25, 83], [42, 75, 36], [72, 18, 69]]) 
newArray = yourArray[0:, -1]
print(newArray)
# %%
import numpy as np
a = np.array([[5, 6, 9], [21 ,18, 27]])
b = np.array([[15 ,33, 24], [4 ,7, 1]])
c = a+b
for x in np.nditer(c,op_flags=['readwrite']):
   x[...] = x*x
print(c)
# %%

#In dòng lẻ, cột chẵn
yourArray = np.array([[3 ,6, 9, 12], [15 ,18, 21, 24], 
[27 ,30, 33, 36], [39 ,42, 45, 48], [51 ,54, 57, 60]]) 
print(yourArray[::2, 1::2])

# %%
# In ra các phần tử âm của list
l=[11, -37, 25, 43, -54]
print([x for a,x in enumerate(l) if x < 0])
# %%
x = [1,5]
print(np.tile(x,3))
# %%
def ngoai_fun(a, b):
    def trong_fun(c, d):
        return c + d
    return trong_fun(a, b)

print(ngoai_fun(7,5))
# %%
L = [{"tên": "Nhung", "tuổi": 20},
       {"tên": "Nam", "tuổi": 20},
       {"tên": "Chinh", "tuổi": 19}]
 
print("In danh sách theo thứ tự giảm dần của tuổi, nếu cùng tuổi sắp tăng dần theo tên: ")
print(sorted(L, key=lambda i: (-i['tuổi'], i['tên'])))

# %%
def yourFunc(name, age=20):
    print(name, age)
yourFunc("name", 22)
# %%
# Đổi chỗ phần tử đầu và cuối của list
def swapFirstLast(ls):
    if len(ls) >= 2:
        ls = ls[-1:] + ls[1:-1] + ls[:1]
    return ls
x =[12, 53, 9, 65, 42]
kq=swapFirstLast(x)
print("Sau khi đổi chỗ phần tử đầu và cuối:",kq)
# %%
def your_show(**kwargs):
    for i in kwargs:
        print(i,end=' ')
your_show(LamAnh="Lam Anh", FiveMillion=5000000)

# %%
def add(a,b):
    return a+b,a*b

ketqua = add(3, 2)
print(ketqua)
# %%
#Pandas
import pandas as pd
s = pd.Series([10,20,30])
print(s)
# %%
s = pd.Series(['Nam','Lan','Minh','Huan'])
print(s)

# %%
s = pd.Series([3]*5)
print(s)

# %%
s = pd.Series(list('abcde'))
print(s)

# %%
s = pd.Series({'Nhi':20,'Xuan':18,'Thuan':19,'Anh':18})
print(s['Nhi'])
print(s)

# %%
import numpy as np
s = pd.Series(np.arange(4,9))
print(s)

# %%
s = pd.Series(np.linspace(0,9,5))
print(s)

# %%
s = pd.Series(np.arange(0,5))
print(s*3)
print(s.values)
print(s.index)

# %%
s = pd.Series([1,2,3])
print(len(s))
print(s.size)
print(s.shape)

# %%
giatri =['Le Hung',20,'Hau Giang']
tieude=['Ho Ten','Tuoi','Que Quan']
s = pd.Series(giatri,index=tieude)
print(s)
print(s['Ho Ten'])

# %%
# head() lấy mặc định 5 phần tử đầu tiên
s = pd.Series(np.arange(1,10),index=list('abcdefghi'))
print(s.head())
print(s.head(3))
print(s.tail())
print(s.take([1,5,8]))
print(s['a'])
print(s[['b','d']])
print(s.loc[['b','d']])
print(s.iloc[[1,3]]) # Nhãn số nguyên thay vì chuỗi ký tự

# %%
# Giá trị là số nguyên
s1 = pd.Series([1,2],index=['a','b'])
s2 = pd.Series([4,1],index=['b','a'])
print(s1+s2)
print(s1*s2)

# Giá trị là số thực
s3 = pd.Series([5,7],index=['b','c'])
print(s1+s3)
# %%
s = pd.Series(np.arange(0,5),index=list('abcde'))
print(s[s>=3])
print((s>=2)&(s<5))
print((s>=0).all())
print((s[s>2]).any())
print((s<2).sum())

# %%
s = pd.Series(np.arange(0,4),index=list('0123'))
s1=s.reindex(['0','2','4'])
print(s1)
s2 = pd.Series([2,4,1,7],index=[0,1,2,3])
print(s+s2)

s.index=s.index.values.astype(int)
print(s+s2)

# %%
s = pd.Series(np.arange(0,4),index=list('0123'))
s1=s.reindex(['0','2','4'],fill_value='GiatriNaN')
print(s1)

# Tự động chèn thêm phần tử mới nếu phần tử đó không tồn tại.
s1['5']=12
print(s1)

del(s1['0'])
print(s1)
# %%
#Datafame
import pandas as pd
import numpy as np
s = pd.DataFrame(np.arange(1,6))
print(s)
# %%
s = pd.DataFrame(np.array([[10,11],[20,21]]))
print(s)
print(s.columns)
# %%
s = pd.DataFrame(np.array([[10,11],[20,21]]),columns=['Missoula','Philadelphia'])
print(s)
print(len(s))
print(s.shape)

# %%
temps_mis=[70,71]
temps_philly=[90,91]
s = pd.DataFrame({'Missoula':temps_mis,'Philadelphia':temps_philly})
print(s)

# %%
temps_mis=pd.Series([70,71])
temps_philly=pd.Series([90,91])
s = pd.DataFrame([temps_mis,temps_philly])
print(s)
# %%
data= pd.read_csv("D:/nba.csv",index_col="Name")
print(data)
data.drop(["Team","Height"],axis=1,inplace=True)
#inplace True sẽ ảnh hưởng đến file dữ liệu gốc, False chỉ xóa bản view của biến data
print(data)
# %%
first=data.loc["Avery Bradley"]
second=data.loc["R.J Hunter"]
print(first,"\n\n",second)

data['College'].head(3)
# %%
import pandas as pd

def f(s1, s2):
    return s1[~s1.isin(s2)]

print(f(pd.Series([1, 2, 3, 4]), pd.Series([5, 6, 3, 1])))
# %%
if 28:
  print('Hi')
else:
  print('Bye')
# %%
import numpy as np
import pandas as pd
s = pd.Series(dict(zip(list('PQRST'),np.arange(5))))
df = s.reset_index()
print(df)

# %%
import pandas as pd
import numpy as np
dfa = pd.DataFrame({'x': ['a', 'b', 'o'] * 3,
                    'y': ['h', 'm', 'l'] * 3,
                    'num': np.random.randint(0, 15, 9)})
dfb = pd.DataFrame({'h': ['a', 'o', 'p'] * 2,
                    'k': ['h', 'l'] * 3,
                    'num': np.random.randint(0, 15, 6)})
df_merged = dfa.merge(dfb, left_on=['x','y'], right_on=['h','k'])


# %%
x = lambda m,n:m*n
print(x(21, 5))

# %%
import numpy as np
x = np.array([9,2,3])
y = np.array([6,7,4])
z = np.stack((y,x),axis=-1)
print(z)
# %%
import numpy as np
x = np.arange(1,28).reshape(3,3,3)
print(x[:,:,0])

# %%
import numpy as np
print(np.arange(9).reshape(3,3)[1:, 1])
# %%
import numpy as np
def f(A):
    return A[:A.shape[0]//2, :A.shape[1]//2]
print(f(np.arange(16).reshape(4,4)))
print(f(np.arange(9).reshape(3,3)))
# %%
import numpy as np
x = np.array([[3,2,4],[0,1,6]])
y = np.zeros((2,3), dtype=np.int16)
z = np.ones((2,3), dtype=np.int16)
t = x + y + z
print(t[1,2])
# %%
import pandas as pd
x = pd.Series([12, 34, 16, 28, 47])
print(x)
print("Đổi Pandas Series thành list")
print(x.tolist())
# %%
courseMark = [('Sci', 78), ('Eng', 92), ('Math', 87)]
courseMark.sort(key = lambda x: x[1])

print(courseMark)
# %%
import numpy as np
print(np.arange(1,28).reshape(3,3,3)[:,:2,:2])

# %%
import pandas as pd
x = pd.Series(['25', 'pandas', '32.1', '49'])
print(x)
print("Đổi kiểu dữ liệu thành kiểu số:")
z = pd.to_numeric(x, errors='coerce')
print(z)
# %%
import pandas as pd
import numpy as np
df = pd.DataFrame(np.random.randint(1,50, 20).reshape(5, -1))
print(df)
print(df.apply(lambda x:x.min()/x.max(),axis=1))

# %%
import numpy as np
def f(A):
    return A[:A.shape[1], :A.shape[1]]
print(f(np.arange(16).reshape(4,4)))
print(f(np.arange(9).reshape(3,3)))
# %%
import numpy as np
import pandas as pd
s = pd.Series(np.random.randint(1, 10, 12))
df = pd.DataFrame(s.values.reshape(3, 4))
print(df)
# %%

import math
def f(x):
    if x <= 1:
        return False
    for m in range(2,math.isqrt(x)+1):
        if x % m == 0:
            return False
    return True
print(f(13))
# %%
import numpy as np
x = np.array([[5],[2],[8]])
y = np.array([[7],[6],[1]])
z = np.hstack((y, x))
print(z)
# %%
import pandas as pd
df = pd.DataFrame({'col1':[1,2,3,4,5],'col2':[5,4,6,8,9],'col3':[8,7,5,12,9]})
df1 = df.iloc[:-3]
print(df1)
# %%
import pandas as pd
def f(s1,s2):
    return s1[~s1.isin(s2)]
print(f(pd.Series([1, 2, 3, 4]),pd.Series([5, 6, 3, 1])))
# %%
import numpy as np
print(np.arange(9).reshape(3,3)[::-1])

# %%
import pandas as pd
x = pd.Series([
    ['Red', 'Blue', 'Green'],
    ['White', 'Black'],
    ['Purple']])
print("SeriesOfList:")
print(x)
x = x.apply(pd.Series).stack().reset_index(drop=True)

print("\nSeries:")
print(x)
# %%
import numpy as np
def f(A):
    return A[:2, :2]
print(f(np.arange(16).reshape(4,4)))
print(f(np.arange(9).reshape(3,3)))
# %%
import pandas as pd
import numpy as np
df = pd.DataFrame(np.random.randint(1,100,50).reshape(5,-1))
print(df)
print([df.iloc[i].corr(df.iloc[i+1]) for i in range(df.shape[0]-1)])

# %%
import pandas as pd
import numpy as np
df = pd.DataFrame(np.random.randint(1,50, 20).reshape(5, -1))
print(df)
print(df.min(axis=1)/df.max(axis=1))

# %%

def F(L):
    if len(L) >= 2:
        L = L[-1:] + L[1:-1] + L[:1]
    return L

L=[42, 51, 19, 67, 18]
print('Trước khi đổi chỗ:', L)
print('Sau khi đổi chỗ:', F(L))
# %%
import numpy as np
x = np.array([[2, 1, 0], [4, 3, 5]])
y = x.sum(axis=1)
print(y)
# %%
m = [31,24,32,14,65,46,37,28]
bp = list(map(lambda x: x**2, m))
print("Bình phương các số:")
print(bp)
# %%
import pandas as pd
se = pd.Series(list('abcdef xyz Ohk abc'))
count = se.value_counts()
hh = se.replace(' ',count.index[-1])
print(hh.str.cat())
# %%
import numpy as np
x = np.array([9,2,3])
y = np.array([6,7,4])
z = np.hstack((x, y))
print(z)
# %%
import pandas as pd

import numpy as np

exam_data = {'name':['A','S','T','K','E','V','Y','L','H','B'],

            'score':[12.5,9,15.5,np.nan,8,22,14.5,np.nan,9,20],

            'attempts':[1,3,2,3,2,3,1,1,2,3],

            'quality':['yes','no','yes','no','no','yes','yes','no','no','yes']}

df = pd.DataFrame(exam_data)
df['quality']=df['quality'].replace({'yes':True,'no':False})
print(df)
# %%
import numpy as np
x = np.array([[5],[2],[8]])
y = np.array([[7],[6],[1]])
z = np.vstack((x, y))
print(z)
# %%
print(15&12)
# %%
def maxi(a, b):
    if a > b:
        print(a, 'lon nhat')
    elif a == b:
        print(a, '=', b)
    else:
        print(b, 'lon nhat')
maxi(3, 4)
# %%
x = lambda m,n:m*n
print(x(21, 5))

# %%
import numpy as np
def f(x,m,s):
    n = len(x) - m + 1
    return np.array([x[k:k+m] for k in range(0, n, s)])
print('Vidu 1:\n',f(np.arange(10),5,3))
print('Vidu 2:\n',f(np.arange(10),5,2))

# %%
import numpy as np
print(np.arange(9).reshape(3,3)[1:,1])
# %%
s = "Lap trinh Python"
print(s.startswith('P'),s[10:].startswith('P'))
# %%
import numpy as np
x = np.array([8,1,3])
y = np.array([6,7,4])
z = np.stack((x, y), axis=0)

print(z)
# %%
import pandas as pd
x = pd.Series(['54', '20', 'pandas', '8.5', '92'])
print("Data Series ban đầu:")
print(x)
print("\nData Series sau khi thêm dữ liệu:")
z = pd.concat([x,pd.Series(['68','python'])],axis=0)
print(z)
# %%
import pandas as pd
import numpy as np
L = list('ABCDE')
A = np.arange(5)
S = pd.Series(A,L)
print(S)
# %%
import pandas as pd

import numpy as np

d = {'n':['A','S','T','K','E','V','Y','L','H','B'],

            's':[12.5,9,15.5,np.nan,8,22,14.5,np.nan,9,20],

            'a':[1,3,np.nan,3,2,3,1,1,2,3],

            'q':['yes','no','yes','no','no','yes','yes','no','no','yes']}

df = pd.DataFrame(d)

print(df.isnull().sum().sum())
print(df.isna().sum().sum())
# %%
import pandas as pd
import numpy as np
x = pd.Series(['25', 'pandas', '32.1', '49'])
print(x)
print("Series thành mảng:")
z = x.to_numpy()
print(z)
# %%
True = False
while True:
    print(True)
    break
# %%
import numpy as np
def f(A):
    return A[[1,1,1,0,2],[0,1,2,1,1]]


x= np.array([1,4,7,10,13,16,19,22,25]).reshape(3,3)
print(f(x))
# %%
import pandas as pd
df = pd.DataFrame({'col1':[1,2,3,4,5], 'col2':[5,4,6,8,9], 'col3':[8,7,5,12,9]})
df1 = df.loc[:,df.columns!='col3']

print(df1)
# %%

from functools import reduce

L = [-13, -32, -24, 45, -56, 93]

x = reduce(lambda a, b : a + [b] if b<0 else a,L,[])

print("Các số âm trong list L: ", *x)
# %%
import numpy as np
import pandas as pd
s = pd.Series(np.random.randint(1, 10, 12))
df = pd.DataFrame(s.values.reshape(3, 4))
print(df)

# %%
import pandas as pd
import numpy as np
df = pd.DataFrame(np.random.randint(1,100,50).reshape(5,-1))
print(df)
print(list(np.around([np.corrcoef(df.iloc[i],df.iloc[i+1])[0,1] for i in range(df.shape[0]-1)],2)))
# %%
import numpy as np
def f(A):
    return A[:(A.shape[1]//2),:(A.shape[1]//2)]
print(f(np.arange(16).reshape(4,4)))
print(f(np.arange(9).reshape(3,3)))
# %%
original_list = list(range(10))  # Tạo list từ 0 đến 9
duplicated_list = list(range(10)) * 2  # Nhân đôi list
print(duplicated_list)
# %%
word = "ước"
if "ơ" in word:
    print("True")
else:
    print("False")
# %%
a = int(input('a = '))
b = int(input('b = '))
m = int(input('m = '))

print((a+4*m+b)/6)
# %%
a = int(input("a = "))
b = int(input("b = "))
m = int(input("m = "))

print("ET: ", (a + 4 * m + b) / 6)
# %%
class MyBigNumber:
    def __init__(self):
        self.log = []

    def sum(self, stn1, stn2):
        # Đảo ngược chuỗi để dễ cộng từ phải sang trái
        stn1 = stn1[::-1]
        stn2 = stn2[::-1]

        result = ""
        carry = 0

        # Duyệt chuỗi từ phải sang trái
        for i in range(max(len(stn1), len(stn2))):
            # Lấy số tại vị trí i, nếu không có thì coi là 0
            digit1 = int(stn1[i]) if i < len(stn1) else 0
            digit2 = int(stn2[i]) if i < len(stn2) else 0

            # Cộng các chữ số và lưu lại nhớ
            total = digit1 + digit2 + carry
            carry = total // 10
            result = str(total % 10) + result

            # Ghi log lại các bước tính toán
            self.log.append(
                f"Bước {i+1}: {digit1} + {digit2} + {carry} = {total} (ghi lại {total%10}, nhớ {total//10})"
            )

        # Nếu vẫn còn số nhớ thì thêm vào kết quả
        if carry:
            result = str(carry) + result

        return result


# Sử dụng lớp MyBigNumber
big_number = MyBigNumber()
result = big_number.sum("00000000112312", "984379586982386689023")
print(f"Kết quả: {result}")

# Hiển thị lịch sử tính toán
for step in big_number.log:
    print(step)

# %%
import random

# Hàm kiểm tra và xác định loại tam giác
def TamGiac(a, b, c):
    if a < b + c and b < a + c and c < a + b:
        if a * a == b * b + c * c or b * b == a * a + c * c or c * c == a * a + b * b:
            return "Day la tam giac vuong"
        elif a == b and b == c:
            return "Day la tam giac deu"
        elif a == b or a == c or b == c:
            return "Day la tam giac can"
        elif a * a > b * b + c * c or b * b > a * a + c * c or c * c > a * a + b * b:
            return "Day la tam giac tu"
        else:
            return "Day la tam giac nhon"
    else:
        return "Ba canh a, b, c khong phai la ba canh cua mot tam giac"

# Hàm tự động sinh test case cho từng loại tam giác
def generate_test_cases():
    test_cases = {}
    
    # Trường hợp không phải là tam giác
    while True:
        a, b, c = random.randint(1, 20), random.randint(1, 20), random.randint(1, 20)
        if TamGiac(a, b, c) == "Ba canh a, b, c khong phai la ba canh cua mot tam giac":
            test_cases["Not a Triangle"] = (a, b, c)
            break

    # Tam giác vuông
    while True:
        a, b, c = random.randint(1, 20), random.randint(1, 20), random.randint(1, 20)
        if TamGiac(a, b, c) == "Day la tam giac vuong":
            test_cases["Right Triangle"] = (a, b, c)
            break

    # Tam giác đều
    while True:
        a = b = c = random.randint(1, 20)
        if TamGiac(a, b, c) == "Day la tam giac deu":
            test_cases["Equilateral Triangle"] = (a, b, c)
            break

    # Tam giác cân
    while True:
        a = b = random.randint(1, 20)
        c = random.randint(1, 20)
        if a != c and TamGiac(a, b, c) == "Day la tam giac can":
            test_cases["Isosceles Triangle"] = (a, b, c)
            break

    # Tam giác tù
    while True:
        a, b, c = random.randint(5, 20), random.randint(5, 20), random.randint(5, 20)
        if TamGiac(a, b, c) == "Day la tam giac tu":
            test_cases["Obtuse Triangle"] = (a, b, c)
            break

    # Tam giác nhọn
    while True:
        a, b, c = random.randint(1, 20), random.randint(1, 20), random.randint(1, 20)
        if TamGiac(a, b, c) == "Day la tam giac nhon":
            test_cases["Acute Triangle"] = (a, b, c)
            break

    return test_cases

# In các test case sinh tự động
generated_cases = generate_test_cases()
for case_type, (a, b, c) in generated_cases.items():
    print(f"{case_type} -> a={a}, b={b}, c={c} | Expected: {TamGiac(a, b, c)}")

# %%
