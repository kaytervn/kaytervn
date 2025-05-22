print("Bài toán sắp xếp quân hậu")
n = int(input("Nhập n số quân hậu cho bàn cờ n x n: "))
chessboard = [[0 for _ in range(n)] for _ in range(n)]
col = 0

if (4 > n > 1):
    print("Không có lời giải")
    exit(0)


def is_valid(x, y):
    for i in range(1, y + 1):
        if ((x - i >= 0 and y - i >= 0 and chessboard[x - i][y - i] == 1) or (
                x + i < n and y - i >= 0 and chessboard[x + i][y - i] == 1) or (
                y - i >= 0 and chessboard[x][y - i]) == 1):
            return False

    for i in range(1, n - y):
        if ((x - i >= 0 and y + i < n and chessboard[x - i][y + i] == 1) or (
                x + i < n and y + i < n and chessboard[x + i][y + i] == 1) or (
                y + i < n and chessboard[x][y + i] == 1)):
            return False

    for i in range(1, x + 1):
        if chessboard[x - i][y] == 1:
            return False

    for i in range(1, n - x):
        if chessboard[x + i][y] == 1:
            return False

    return True


def output():
    print()
    for i in range(n):
        print(chessboard[i])


def arranges_queens(y):
    if y == n:
        output()
    else:
        for i in range(n):
            if is_valid(i, y):
                chessboard[i][y] = 1
                arranges_queens(y + 1)
                chessboard[i][y] = 0


arranges_queens(col)
