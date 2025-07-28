#include<iostream>
void nhap(int &a, int &b, int &c);
int soNhoNhat(int a, int b, int c);
void xuat(int kq);
using namespace std;
int main()
{
	int a, b, c;
	nhap(a, b, c);
	int kq=soNhoNhat(a, b, c);
	xuat(kq);
	return 0;
}
void nhap(int &a, int &b, int &c)
{
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
	cout<<"Nhap c: "; cin>>c;
}
int soNhoNhat(int a, int b, int c)
{
	int min=a;
	if (b<min) min=b;
	if (c<min) min=c;
	return min;
}
void xuat(int kq)
{
	cout<<"So nho nhat la: "<<kq;
}
