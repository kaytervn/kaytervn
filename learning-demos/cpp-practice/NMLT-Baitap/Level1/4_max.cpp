#include<iostream>
void nhap(int &a, int &b);
int soLonNhat(int a, int b);
void xuat(int kq);
using namespace std;
int main()
{
	int a, b;
	nhap(a, b);
	int kq=soLonNhat(a, b);
	xuat(kq);
	return 0;
}
void nhap(int &a, int &b)
{
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
}
int soLonNhat(int a, int b)
{
	int k=max(a, b);
	return k;
}
void xuat(int kq)
{
	cout<<"So lon nhat la: "<<kq;
}
