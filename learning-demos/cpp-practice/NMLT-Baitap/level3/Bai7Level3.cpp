#include<iostream>
using namespace std;
void nhap(int &n);
int tongCacChuSoCuaN(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = tongCacChuSoCuaN(n);
	xuat (kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int tongCacChuSoCuaN(int n)
{
	int s=0;
	for(int tmp; n>0; n = n/10)
	{
		tmp = n%10;
		s=s+tmp;
	}
	return s;
}
void xuat(int kq)
{
	cout<<kq;
}
