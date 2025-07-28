#include<iostream>
void nhap(int &a, int &b);
int tinhThuong(int a, int b, float &thuong);
void xuat(int kq, float thuong);
using namespace std;
int main()
{
	int a, b;
	float thuong;
	nhap (a, b);
	int kq=tinhThuong(a, b, thuong);
	xuat(kq, thuong);
	return 0;
}
void nhap(int &a, int &b)
{
	cout<<"So bi chia A: "; cin>>a;
	cout<<"So chia B: "; cin>>b;
}
int tinhThuong(int a, int b, float &thuong)
{
	if (b==0)
		return 0;
	else
	{
		thuong = float(a)/b;
		return 1;
	}
}
void xuat(int kq, float thuong)
{
	if (kq == 1) 
		cout<<"Thuong 2 so A va B la: "<<thuong;
	else 
		cout<<"Khong chia duoc! ";
}
