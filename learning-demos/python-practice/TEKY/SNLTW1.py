books = [
    "Những người khốn khổ",
    "Jane Eyre",
    "Đồi gió hú",
    "Kiêu hãnh và định kiến",
    "Chuyện hai thành phố",
    "Chuyện ngày xưa",
    "Đại sảnh và phòng ngủ",
    "Anna Karenina",
    "Những năm tháng ảm đạm",
    "Bồ câu và cành cây olive",
]
exit = False
while not exit:
    print("\n--- MENU QUẢN LÝ SÁCH ---")
    print("1. Hiển thị sách")
    print("2. Thêm sách")
    print("3. Tìm sách theo từ khóa")
    print("4. Thay tên sách")
    print("5. Xóa sách")
    print("6. Đảo ngược từ trong tiêu đề sách")
    print("7. Tìm sách có tiêu đề dài nhất")
    print("8. Thoát chương trình")
    choice = input("Lựa chọn: ")
    print("\n" * 15)

    if choice == "1":
        print("Danh sách sách:")
        for i in range(len(books)):
            print(f"{i+1}. {books[i]}")
    elif choice == "2":
        title = input("Nhập tên sách: ")
        books.append(title)
        print("Đã thêm sách thành công!")
    elif choice == "3":
        keyword = input("Nhập từ khóa: ")
        for i in range(len(books)):
            if keyword.lower() in books[i].lower():
                print(f"{i+1}. {books[i]}")
    elif choice == "4":
        book_number = int(input("Nhập số thứ tự sách muốn đổi tên: "))
        new_title = input("Nhập tên sách mới: ")
        books[book_number] = new_title
        print("Đã thay sách thành công!")
    elif choice == "5":
        book_number = int(input("Nhập số thứ tự sách muốn xóa: "))
        books.pop(book_number)
    elif choice == "6":
        book_number = int(input("Nhập số thứ tự sách: "))
        book = books[book_number - 1]
        word_list = book.split()
        word_list.reverse()
        reversed_title = " ".join(word_list)
        print(f"Tiêu đề đảo ngược: {reversed_title}")
    elif choice == "7":
        book_lengths = []
        for book in books:
            book_lengths.append(len(book))
        longest_book_index = book_lengths.index(max(book_lengths))
        print(f"Sách dài nhất: {books[longest_book_index]}")
    elif choice == "8":
        print("Chương trình kết thúc!")
        exit = True
    else:
        print("Vui lòng chọn chức năng trên menu!")
