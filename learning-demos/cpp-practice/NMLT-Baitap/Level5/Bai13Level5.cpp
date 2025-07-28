#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n, float &x);
float tinhTongS(int n, float x);
void xuat(float kq);
int main()
{
	int n;
	float x;
	nhap(n, x);
	float kq=tinhTongS(n, x);
	xuat(kq);
	return 0;
}
void nhap(int &n, float &x)
{
	cin>>n>>x;
}
float tinhTongS(int n, float x)
{
	int p=1;
	float s=0;
	for(int i=1; i<=n; i++)
	{
		p *= i;
		s += pow(x, i)/p;
	}
	return 1+s;
}
void xuat(float kq)
{
	cout<<kq;
}

