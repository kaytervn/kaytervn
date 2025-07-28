#include<iostream>
using namespace std;
float tinhTongS(int n);
void nhap(int &n);
void xuat(float kq);
int main ()
{
	int n;
	nhap(n);
	float kq = tinhTongS(n);
	xuat (kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
float tinhTongS(int n)
{
	float s=0;
	for(int i =1; i<=n; i++)
	{
		s= s+ 1/(float)i;
	}
	return s;
}
void xuat(float kq)
{
	cout<<kq;
}
