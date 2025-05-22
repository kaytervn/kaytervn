#%% Tạo list tùy ý, tìm phần tử chia hết cho 5 lớn nhất
list=[1,5,6,10,-4,-3.6,8,20,15,23]
max=0
for id in list:
    if id %5==0 and id >max:
        max=id
print('Phan tu chia het cho 5 lon nhat la ',max)
# %% Tạo list tùy ý, xóa các phần tử lớn hơn A
a=int(input('Nhap A: '))
list1=[1,2,5,7,5,4,8,3,2,6,7,3,5,3,5]

print('Mang sau khi xoa cac phan tu lon hon A: ')
for id in list1:
    if id <= a:
        print(id)

# %% Tạo list tùy ý tăng dần, chèn B vẫn tăng dần
listTang=[1,5,7,17,34,56,78,99]
b=int(input('Nhap B: '))

for id in range(0,len(listTang),1):
    if listTang[id] < b and listTang[id+1] > b:
        listTang.insert(id+1,b)

print('Mang sau khi chen B: ')
for i in listTang:
    print(i)
# %% Tìm n số nguyên tố đầu tiên lưu vào list
n=int(input('Nhap N: '))
listSNT=[]

def ktSNT(a):
    '''
    Input: Nhan a
    Output: Kiem tra a co phai SNT khong? Tra ve 1 hoac 0
    '''
    if a<2:
        return 0
    for i in range(2,a,1):
        if a%i==0:
            return 0
    return 1

for a in range(0,n,1):
    if ktSNT(a)==1:
        listSNT.append(a)

for i in listSNT:
    print(i)
# %% Hàm nhận mã SV, in ra các môn dưới 5
bangDiem = {
    1112233: {'Tin ky thuat': 9.2, 'An toan dien': 2.5, 'The duc': 4.1},
    1112244: {'Tin ky thuat': 3.7, 'The duc': 9.0}}

def nhanMaSV_inMonNo(maSV):
    '''
    Input: Ma SV
    Output: Ten Mon No
    '''
    listMon=[]

    dictDiem=bangDiem[maSV]
    for i in dictDiem:
        if dictDiem[i] < 5.0:
            listMon.append(i)
    return listMon

maSV=int(input('Nhap MSSV: '))
mon=nhanMaSV_inMonNo(maSV)
print(mon)

# %% Hàm nhận MSSV, return điểm trung bình,
# mã không hợp: báo không tìm thấy, return -1
bangDiem = {
    1112233: {'Tin ky thuat': 9.2, 'An toan dien': 8.9, 'The duc': 4.1} ,
    1112244: {'Tin ky thuat': 3.7, 'The duc': 9.0}}

maSV=bangDiem.keys()
maInput=input('Nhap MSSV: ')


def kiemTraMaSV(maInput):
    '''
    Input: Nhan ma Sv
    Output: Kiem tra ma hop le, dung return ma, neu khong tra ve -1
    '''
    for i in maSV:
        if str(maInput) == str(i):
            return int(maInput)
    return -1

def diemTrungBinh(maSV):
    '''
    Input: Nhan ma Sv
    Output: Tra ve diem Trung binh
    '''
    s=0
    dictDiem=bangDiem[maSV]
    listDiem=list(dictDiem.values())
    for i in listDiem:
        s +=i
    avg= s/len(listDiem)
    return avg

def xuat(maInput):
    kt= kiemTraMaSV(maInput)
    if kt==-1:
        print('Khong tim thay MSSV')
    else:
        DTB=diemTrungBinh(kt)
        print(DTB)

xuat(maInput)
# %% Hàm kiểm tra chính tả
listTu=['anh', 'ba', 'ban', 'binh', 'co', 'dung', 'ten', 'toi', 'nguoi']
s=str(input('Nhap vao chuoi ki tu: ')).lower()

def no_accent_vietnamese(s):
    s = re.sub('[áàảãạăắằẳẵặâấầẩẫậ]', 'a', s)
    s = re.sub('[ÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ]', 'A', s)
    s = re.sub('[éèẻẽẹêếềểễệ]', 'e', s)
    s = re.sub('[ÉÈẺẼẸÊẾỀỂỄỆ]', 'E', s)
    s = re.sub('[óòỏõọôốồổỗộơớờởỡợ]', 'o', s)
    s = re.sub('[ÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]', 'O', s)
    s = re.sub('[íìỉĩị]', 'i', s)
    s = re.sub('[ÍÌỈĨỊ]', 'I', s)
    s = re.sub('[úùủũụưứừửữự]', 'u', s)
    s = re.sub('[ÚÙỦŨỤƯỨỪỬỮỰ]', 'U', s)
    s = re.sub('[ýỳỷỹỵ]', 'y', s)
    s = re.sub('[ÝỲỶỸỴ]', 'Y', s)
    s = re.sub('đ', 'd', s)
    s = re.sub('Đ', 'D', s)
    return s
no_accent_vietnamese(s)
print(s)

remove_accent(s)
print(s)

print(s)
def kiemTraChinhTa(s):
    '''
    input: nhan vao string
    output: tra ve loi sai ct va vi tri cua cac tu sai
    '''
# %%
# -*- coding: utf-8 -*-
import math
# %%
