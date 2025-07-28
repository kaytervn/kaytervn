#include<iostream>
using namespace std;
void nhap(int &n);
double tinhTongS(int n);
void xuat(double kq);
int main()
{
	int n;
	nhap(n);
	double kq=tinhTongS(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
double tinhTongS(int n)
{
	int s=0; 
	int p=1;
	double tong=0;
	for(int i=1; i<=n; i++)
	{
		p *= i;
		s += i;
		tong += (double)s/p;
	}
	return tong;
}
void xuat(double kq)
{
	cout<<kq;
}

