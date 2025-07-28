#include<iostream>
using namespace std;
int tinhTongS(int n);
void nhap(int &n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = tinhTongS(n);
	xuat (kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int tinhTongS(int n)
{
	int s=1;
	for(int i =1; i<=n; i++)
	{
		s= s*i;
	}
	return s;
}
void xuat(int kq)
{
	cout<<kq;
}
