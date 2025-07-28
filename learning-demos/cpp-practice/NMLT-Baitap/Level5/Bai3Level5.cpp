#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n);
int kiemTraSoNguyenTo(int n);
int demSoNguyenTo(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq=demSoNguyenTo(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraSoNguyenTo(int n)
{
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}
int demSoNguyenTo(int n)
{
	int dem=0;
	for(int i=2; i<n; i++)
	{
		if(kiemTraSoNguyenTo(i)!=0)
			dem++;
	}
	return dem;
}
void xuat(int kq)
{
	cout<<kq;
}
