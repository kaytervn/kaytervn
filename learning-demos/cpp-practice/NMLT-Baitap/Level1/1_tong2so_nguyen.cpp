#include<iostream>
using namespace std;
void nhap(int &a, int &b);
void xuat(int kq);
int tong(int a, int b);
int main()
{
	int a, b;
	nhap (a, b);
	int kq=tong(a, b);
	xuat (kq);
	return 0;
}
void nhap(int &a, int &b)
{
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
}
void xuat(int kq)
{
	cout<<"Tong: "<<kq;
}
int tong(int a, int b)
{
	int t= a + b;
	return t;
}
