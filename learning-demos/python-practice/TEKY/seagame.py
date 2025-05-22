print("Vietnam")
VN_vang = int(input("Nhap vao so huy chuong vang dat duoc: "))
VN_bac = int(input("Nhap vao so huy chuong bac dat duoc: "))
VN_dong = int(input("Nhap vao so huy chuong vang dat duoc: "))

print()
print("Singapore")
SP_vang = int(input("Nhap vao so huy chuong vang dat duoc: "))
SP_bac = int(input("Nhap vao so huy chuong bac dat duoc: "))
SP_dong = int(input("Nhap vao so huy chuong vang dat duoc: "))

print()
print("Malaysia")
ML_vang = int(input("Nhap vao so huy chuong vang dat duoc: "))
ML_bac = int(input("Nhap vao so huy chuong bac dat duoc: "))
ML_dong = int(input("Nhap vao so huy chuong vang dat duoc: "))

print()
print("Brunei")
BR_vang = int(input("Nhap vao so huy chuong vang dat duoc: "))
BR_bac = int(input("Nhap vao so huy chuong bac dat duoc: "))
BR_dong = int(input("Nhap vao so huy chuong vang dat duoc: "))

print()
print("Laos")
LA_vang = int(input("Nhap vao so huy chuong vang dat duoc: "))
LA_bac = int(input("Nhap vao so huy chuong bac dat duoc: "))
LA_dong = int(input("Nhap vao so huy chuong vang dat duoc: "))

#Ket qua
VN = VN_vang*3 + VN_bac*2 + VN_dong
SP = SP_vang*3 + SP_bac*2 + SP_dong
ML = ML_vang*3 + ML_bac*2 + ML_dong
BR = BR_vang*3 + BR_bac*2 + BR_dong
LA = LA_vang*3 + LA_bac*2 + LA_dong


#Bang diem
print()
print("="*45)
print("Quoc gia", "\tVang", "\tBac", "\tDong", "\tDiem")
print()
print("Vietnam", "\t" , VN_vang, "\t", VN_bac, "\t", VN_dong, "\t", VN)
print()
print("Singapore", "\t" , SP_vang, "\t", SP_bac, "\t", SP_dong, "\t", SP)
print()
print("Malaysia", "\t" , ML_vang, "\t", ML_bac, "\t", ML_dong, "\t", ML)
print()
print("Brunei", "\t"*2 , BR_vang, "\t", BR_bac, "\t", BR_dong, "\t", BR)
print()
print("Laos", "\t"*2 , LA_vang, "\t", LA_bac, "\t", LA_dong, "\t", LA)
