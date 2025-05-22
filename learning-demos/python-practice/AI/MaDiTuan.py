print("Bài toán mã đi tuần")
n = int(input("Nhập số nguyên n cho bàn cờ n x n: "))

print("\nNhập vị trí (x, y) bắt đầu của con mã: ")
start_x = int(input("x: "))
start_y = int(input("y: "))

chessboard = [[0 for _ in range(n)] for _ in range(n)]

moves = [(1, 2), (1, -2), (-1, 2), (-1, -2),
         (2, 1), (2, -1), (-2, 1), (-2, -1)]

count = 0


def is_valid(x, y):
    if x >= 0 and x < n and y >= 0 and y < n and chessboard[x][y] == 0:
        return True
    return False


def tour(x, y):
    global count

    count += 1
    chessboard[x][y] = count

    if count >= n * n:
        print()
        for i in range(n):
            print(chessboard[i])
        exit(0)

    for dx, dy in moves:
        new_x, new_y = x + dx, y + dy

        if is_valid(new_x, new_y):
            tour(new_x, new_y)

    count -= 1
    chessboard[x][y] = 0


tour(start_x, start_y)
print("Không tìm thấy lời giải")
