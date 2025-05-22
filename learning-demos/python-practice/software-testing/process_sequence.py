def process_sequence(input_sequence):
    # Tách chuỗi thành danh sách các số nguyên
    numbers = list(map(int, input_sequence.split("-")))

    # Tăng mỗi số lên 1
    modified_numbers = [num + 1 for num in numbers]

    # Chuyển danh sách thành chuỗi với dấu '-' ngăn cách
    output_sequence = "-".join(map(str, modified_numbers))

    return output_sequence


# Chuỗi đầu vào
input_sequence = "1-2-3-5-7-8-10-13-15-16-18-19-23-24-26-27-30-31-32"
# Xử lý và in ra kết quả
output_sequence = process_sequence(input_sequence)
print("1-" + output_sequence)
