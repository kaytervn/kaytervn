#include<iostream>
using namespace std;
void nhap(int &a, int &b, int&n);
int tinhTongCoDK(int a, int b, int n);
void xuat(int kq);
int main ()
{
	int a,b,n;
	nhap(a,b,n);
	int kq = tinhTongCoDK(a,b,n);
	xuat (kq);
	return 0;
}
void nhap(int &a, int &b, int&n)
{
	cin>>a>>b>>n;
}
int tinhTongCoDK(int a, int b, int n)
{
	int s=0;
	if(a<n && b<n)
		for(int i=0; i<n; i++)
		{
			if (i%a==0 && i%b!=0)
				s+=i;
		}
	return s;
}
void xuat(int kq)
{
	cout<<kq;
}
