#include<iostream>
#include<cmath>
float uclnSoThuc(float x, float y);
void nhap(float &x, float &y);
int UCLN(int a, int b);
void xuat(float kq);
using namespace std;

int main ()
{
	float x,y;
	nhap(x,y);
	float kq=uclnSoThuc(x,y);
	xuat(kq);
	return 0;
}
void nhap(float &x, float &y)
{
	cin>>x>>y;
}
float uclnSoThuc(float x, float y)
{
	int xx=(int)x;
	int yy=(int)y;
	return UCLN(xx,yy);
}

int UCLN(int a, int b)
{
	a=abs(a);
	b=abs(b);
	while(a!=b)
	{
		if (a>b)
			a-= b;
		else
			b-= a;
	}
	return a;
}

void xuat(float kq)
{
	cout<<kq;
}
