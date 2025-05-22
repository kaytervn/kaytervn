import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
from tabulate import tabulate
from PIL import Image, ImageTk
import sys
import os


class User:
    def __init__(self, username, password, role):
        self.username = username
        self.password = password
        self.role = role

    def check_exist_user(username):
        f = open("data/users.txt", "r+")
        data = f.readlines()
        f.seek(0)
        for line in data:
            data2 = line.split(";")
            if data2[0].lower() == username.lower():
                f.close()
                return True
        f.close()
        return False

    def valid_user(username, password):
        f = open("data/users.txt", "r+")
        data = f.readlines()
        f.seek(0)
        for line in data:
            data2 = line.split(";")
            if data2[0].lower() == username.lower() and data2[1] == password:
                f.close()
                return User(data2[0], data2[1], data2[2][:-1])
        f.close()
        return None

    def list_users():
        f = open("data/users.txt", "r+", encoding="utf-8")
        data = f.readlines()
        f.seek(0)
        users = []
        for i in range(len(data)):
            data2 = data[i].split(";")
            users.append(User(data2[0], data2[1], data2[2][:-1]))
        f.close()
        return users

    def list_usernames():
        users = []
        for item in User.list_users():
            users.append(item.username)
        return users

    def find_user_by_username(username):
        f = open("data/users.txt", "r+", encoding="utf-8")
        data = f.readlines()
        f.seek(0)
        for i in range(len(data)):
            data2 = data[i].split(";")
            if data2[0] == username:
                f.close()
                return User(data2[0], data2[1], data2[2][:-1])


class Book:
    def __init__(self, title, genre, content):
        self.title = title
        self.genre = genre
        self.content = content

    def find_by_filename(filename):
        f = open("data/" + filename, "r+", encoding="utf-8")
        data = f.readlines()
        content = "".join(data[2:])
        f.seek(0)
        return Book(data[0][:-1], data[1][:-1], content[:-1])


def show_password():
    if show_password_cb.get():
        password.config(show="")
    else:
        password.config(show="*")


def login():
    user = User.valid_user(username.get(), password.get())
    if user != None:
        window.destroy()
        run_program(user)
    else:
        messagebox.showwarning("Cảnh báo!", "Sai tên tài khoản hoặc mật khẩu!")


def signup():
    f = open("data/users.txt", "a+")
    if User.check_exist_user(username.get()):
        messagebox.showwarning("Cảnh báo!", "Tên tài khoản đã tồn tại!")
    else:
        user = username.get() + ";" + password.get() + ";" + "user\n"
        f.write(user)
        f.close()
        messagebox.showinfo("Thông báo!", "Đăng ký tài khoản thành công!")


def waiting():
    if mode_rb.get() == "login":
        login()
    elif mode_rb.get() == "signup":
        signup()


def logout():
    python = sys.executable
    os.execl(python, python, *sys.argv)


def update_display():
    book1.config(text=Book.find_by_filename("book1.txt").title)
    book2.config(text=Book.find_by_filename("book2.txt").title)
    book3.config(text=Book.find_by_filename("book3.txt").title)
    book4.config(text=Book.find_by_filename("book4.txt").title)
    user_cb.config(value=User.list_usernames())
    user_cb.config(state="readonly")
    user_cb.current(0)


def list_table_users():
    table = [["[TÀI KHOẢN]", "[MẬT KHẨU]", "[VAI TRÒ]"]]
    users = User.list_users()
    for i in range(len(users)):
        table.append([users[i].username, users[i].password, users[i].role])
    return table


def print_list_users():
    os.system("cls")
    print("DANH SÁCH NGƯỜI DÙNG")
    print(tabulate(list_table_users()))


def search_user():
    os.system("cls")
    print("TÌM KIẾM NGƯỜI DÙNG")
    table = list_table_users()
    new_table = [["[TÀI KHOẢN]", "[MẬT KHẨU]", "[VAI TRÒ]"]]
    keyword = input("Nhập từ khóa: ")
    for i in range(len(table)):
        if keyword.lower() in table[i][0].lower():
            new_table.append(table[i])
    if len(new_table) > 1:
        print(tabulate(new_table))
    else:
        print("[KHÔNG CÓ KẾT QUẢ]")


def delete_user(username):
    users = User.list_users()
    f = open("data/users.txt", "w+", encoding="utf-8")
    for user in users:
        if user.username != username:
            f.write(user.username + ";" + user.password + ";" + user.role + "\n")
    f.close()
    update_display()
    messagebox.showwarning("Thông báo!", "Xóa thành công!")


def edit_book(book, filename):
    f = open("data/" + filename, "w+", encoding="utf-8")
    f.write(book.title + "\n" + book.genre + "\n" + book.content)
    f.close()
    edit_book_form.destroy()
    update_display()


def f_edit_book_form(book, filename):
    global edit_book_form
    edit_book_form = tk.Tk()
    edit_book_form.geometry("600x600+600+150")
    edit_book_form.resizable(False, False)
    tk.Label(edit_book_form, text="Tiêu đề: ", font=("Helvetica", 20, "bold")).place(
        x=20, y=80
    )
    title = tk.Entry(edit_book_form, font=("Helvetica", 20), width=25)
    title.place(x=200, y=80)
    title.insert(0, book.title)
    tk.Label(edit_book_form, text="Thể loại: ", font=("Helvetica", 20, "bold")).place(
        x=20, y=130
    )
    genre = ttk.Combobox(
        edit_book_form,
        font=("Helvetica", 20),
        width=24,
        values=[
            "Tiểu thuyết",
            "Kỹ năng sống",
            "Thiếu nhi",
            "Lập trình",
            "Truyện ngắn",
            "Thơ",
            "Tản văn",
            "Tự truyện",
            "Khoa học viễn tưởng",
            "Kinh dị",
            "Lãng mạn",
            "Hài hước",
            "Trinh thám",
        ],
    )
    genre.set(book.genre)
    genre.place(x=200, y=130)
    tk.Label(edit_book_form, text="Nội dung: ", font=("Helvetica", 20, "bold")).place(
        x=20, y=180
    )
    content = tk.Text(edit_book_form, width=50, height=12, font=("Helvetica", 15))
    content.place(x=20, y=230)
    content.insert(tk.END, book.content)
    if current_user.role == "admin":
        edit_book_form.title("SỬA THÔNG TIN SÁCH")
        tk.Label(
            edit_book_form,
            text="SỬA THÔNG TIN SÁCH",
            fg="red",
            font=("Tahoma", 30, "bold"),
        ).place(x=80, y=10)
        tk.Button(
            edit_book_form,
            text="Xong",
            bg="lightgreen",
            font=("Helvetica", 20, "bold"),
            command=lambda: edit_book(
                Book(title.get(), genre.get(), content.get("1.0", tk.END)), filename
            ),
        ).place(x=250, y=530)
    else:
        edit_book_form.title("ĐỌC SÁCH")
        tk.Label(
            edit_book_form,
            text="ĐỌC SÁCH",
            fg="red",
            font=("Tahoma", 30, "bold"),
        ).place(x=200, y=10)
        title.config(state="readonly")
        genre.config(state="disabled")
        content.config(state="disabled")


def edit_user(user):
    users = User.list_users()
    for i in range(len(users)):
        if users[i].username == user.username:
            users[i].password = user.password
            users[i].role = user.role
    f = open("data/users.txt", "w+", encoding="utf-8")
    for i in range(len(users)):
        f.write(
            users[i].username + ";" + users[i].password + ";" + users[i].role + "\n"
        )
    f.close()
    edit_user_form.destroy()
    update_display()


def f_edit_user_form():
    global edit_user_form
    user = User.find_user_by_username(user_cb.get())
    edit_user_form = tk.Tk()
    edit_user_form.geometry("550x330+600+150")
    edit_user_form.resizable(False, False)
    edit_user_form.title("SỬA THÔNG TIN NGƯỜI DÙNG")
    tk.Label(
        edit_user_form, text="SỬA NGƯỜI DÙNG", fg="red", font=("Tahoma", 30, "bold")
    ).place(x=100, y=10)
    tk.Label(edit_user_form, text="Tài khoản: ", font=("Helvetica", 20, "bold")).place(
        x=20, y=80
    )
    username = tk.Entry(edit_user_form, font=("Helvetica", 20), width=20)
    username.place(x=200, y=80)
    username.insert(0, user.username)
    username.config(state="readonly")
    tk.Label(edit_user_form, text="Password: ", font=("Helvetica", 20, "bold")).place(
        x=20, y=130
    )
    password = tk.Entry(edit_user_form, font=("Helvetica", 20), width=20)
    password.place(x=200, y=130)
    password.insert(0, user.password)
    tk.Label(edit_user_form, text="Vai trò: ", font=("Helvetica", 20, "bold")).place(
        x=20, y=180
    )
    role_cb = ttk.Combobox(
        edit_user_form, font=("Helvetica", 20), values=["user", "admin"], width=19
    )
    role_cb.set(user.role)
    role_cb.config(state="readonly")
    if user.username == current_user.username:
        role_cb.config(state="disabled")
    role_cb.place(x=200, y=180)
    tk.Button(
        edit_user_form,
        text="Sửa",
        bg="lightgreen",
        font=("Helvetica", 20, "bold"),
        command=lambda: edit_user(User(username.get(), password.get(), role_cb.get())),
    ).place(x=200, y=240)


def run_program(user):
    global book1, book2, book3, book4, user_cb, current_user
    current_user = user
    window = tk.Tk()
    window.geometry("800x500+500+150")
    window.resizable(False, False)
    window.iconphoto(False, ImageTk.PhotoImage(Image.open("images/lib.png")))
    window.title("THƯ VIỆN SỐ")
    tk_image = ImageTk.PhotoImage(Image.open("images/library.jpg").resize((800, 500)))
    background_label = tk.Label(window, image=tk_image)
    background_label.place(x=0, y=0, relwidth=1, relheight=1)
    menu = tk.Menu(window)
    window.config(menu=menu)
    file_menu = tk.Menu(menu, tearoff=0)
    menu.add_cascade(label="Tùy chọn", menu=file_menu)
    file_menu.add_command(label="Đăng xuất", command=logout)
    file_menu.add_separator()
    file_menu.add_command(label="Thoát", command=window.quit)
    tk.Label(text="TÀI KHOẢN: ", fg="red", font=("Tahoma", 15, "bold")).place(
        x=10, y=20
    )
    tk.Label(text=user.username, font=("Helvetica", 15, "bold")).place(x=140, y=20)
    tk.Label(text="VAI TRÒ: ", fg="red", font=("Tahoma", 15, "bold")).place(x=10, y=60)
    tk.Label(text=user.role, font=("Helvetica", 15, "bold")).place(x=110, y=60)
    img1 = ImageTk.PhotoImage(Image.open("images/ngk.jpg").resize((100, 150)))
    book1 = tk.Button(
        image=img1,
        compound="top",
        anchor="s",
        width=150,
        command=lambda: f_edit_book_form(
            Book.find_by_filename("book1.txt"), "book1.txt"
        ),
    )
    img2 = ImageTk.PhotoImage(Image.open("images/dnt.png").resize((100, 150)))
    book2 = tk.Button(
        image=img2,
        compound="top",
        anchor="s",
        width=150,
        command=lambda: f_edit_book_form(
            Book.find_by_filename("book2.txt"), "book2.txt"
        ),
    )
    img3 = ImageTk.PhotoImage(Image.open("images/dmplk.jpg").resize((100, 150)))
    book3 = tk.Button(
        image=img3,
        compound="top",
        anchor="s",
        width=150,
        command=lambda: f_edit_book_form(
            Book.find_by_filename("book3.txt"), "book3.txt"
        ),
    )
    img4 = ImageTk.PhotoImage(Image.open("images/pycoban.jpg").resize((100, 150)))
    book4 = tk.Button(
        image=img4,
        compound="top",
        anchor="s",
        width=150,
        command=lambda: f_edit_book_form(
            Book.find_by_filename("book4.txt"), "book4.txt"
        ),
    )
    ad_lable = tk.Label(
        text="QUẢN LÝ NGƯỜI DÙNG", fg="red", font=("Helvetica", 20, "bold")
    )
    user_cb = ttk.Combobox(font=("Helvetica", 20), width=20)
    ad_edit = tk.Button(
        width=9,
        text="Sửa",
        bg="lightgreen",
        font=("Helvetica", 20, "bold"),
        command=f_edit_user_form,
    )
    ad_delete = tk.Button(
        width=9,
        text="Xóa",
        bg="lightpink",
        font=("Helvetica", 20, "bold"),
        command=lambda: delete_user(user_cb.get()),
    )
    ad_print = tk.Button(
        width=19,
        text="In danh sách",
        bg="lightblue",
        font=("Helvetica", 20, "bold"),
        command=print_list_users,
    )
    ad_find = tk.Button(
        width=19,
        text="Tìm kiếm theo từ khóa",
        bg="yellow",
        font=("Helvetica", 20, "bold"),
        command=search_user,
    )
    update_display()
    if user.role == "admin":
        book1.place(x=10, y=110)
        book2.place(x=10, y=290)
        book3.place(x=180, y=110)
        book4.place(x=180, y=290)
        ad_lable.place(x=400, y=110)
        user_cb.place(x=400, y=160)
        ad_edit.place(x=400, y=210)
        ad_delete.place(x=570, y=210)
        ad_print.place(x=400, y=275)
        ad_find.place(x=400, y=340)
    else:
        book1.place(x=220, y=110)
        book2.place(x=220, y=290)
        book3.place(x=390, y=110)
        book4.place(x=390, y=290)
    window.mainloop()


window = tk.Tk()
window.geometry("600x550+700+150")
window.resizable(False, False)
window.iconphoto(False, ImageTk.PhotoImage(Image.open("images/lib.png")))
window.title("THƯ VIỆN SỐ")
tk.Label(text="THƯ VIỆN SỐ", fg="red", font=("Tahoma", 30, "bold")).place(x=170, y=20)
image = ImageTk.PhotoImage(Image.open("images/user.png").resize((200, 200)))
tk.Label(image=image).place(x=200, y=65)
mode_rb = tk.StringVar(value="login")
tk.Radiobutton(
    text="Đăng nhập", font=("Helvetica", 15), fg="blue", value="login", variable=mode_rb
).place(x=180, y=265)
tk.Radiobutton(
    text="Đăng ký", font=("Helvetica", 15), fg="blue", value="signup", variable=mode_rb
).place(x=325, y=265)
tk.Label(text="Tài khoản: ", font=("Helvetica", 20, "bold")).place(x=100, y=315)
username = tk.Entry(font=("Helvetica", 15), width=20)
username.place(x=275, y=315)
tk.Label(text="Mật khẩu: ", font=("Helvetica", 20, "bold")).place(x=100, y=365)
password = tk.Entry(font=("Helvetica", 15), width=20, show="*")
password.place(x=275, y=365)
show_password_cb = tk.BooleanVar()
tk.Checkbutton(
    text="Hiện mật khẩu",
    font=("Helvetica", 15),
    variable=show_password_cb,
    command=show_password,
).place(x=325, y=415)
tk.Button(
    text="Submit",
    bg="lightgreen",
    font=("Helvetica", 20, "bold"),
    command=waiting,
).place(x=250, y=465)
window.mainloop()
