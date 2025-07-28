#include<iostream>
using namespace std;
void nhap(int &n);
int demSoChinhPhuong(int n);
int kiemTraSoChinhPhuong(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq=demSoChinhPhuong(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraSoChinhPhuong(int n)
{
	int i=0;
	while(i*i <=n)
	{
		if(i*i==n)
			return 1;
		i++;
	}
	return 0;
}
int demSoChinhPhuong(int n)
{
	int dem=0;
	for(int i=1; i<n; i++)
	{
		if(kiemTraSoChinhPhuong(i)==1)
			dem++;
	}
	return dem;
}
void xuat(int kq)
{
	cout<<kq;
}
