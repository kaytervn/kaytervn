#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n);
int soNguyenTo(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = soNguyenTo(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int soNguyenTo(int n)
{
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}
void xuat(int kq)
{
	if(kq==0)
		cout<<"khong la so nguyen to";
	else
		cout<<"la so nguyen to";
}
