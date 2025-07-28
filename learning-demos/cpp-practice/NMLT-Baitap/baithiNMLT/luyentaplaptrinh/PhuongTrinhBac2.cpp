#include<iostream>
#include<cmath>
void nhap(int &a, int &b, int &c);
int nghiem(int a, int b, int c);
void xuat(int kq);
using namespace std;
int main()
{
	int a,b,c;
	nhap(a,b,c);
	int kq=nghiem(a,b,c);
	xuat(kq);
	return 0;
}
void nhap(int &a, int &b, int &c)
{
	cin>>a>>b>>c;
}
int nghiem(int a, int b, int c)
{
	float dt=b*b-4*a*c;
	if (a==0)
		if (b==0)
		{
			if (c==0) 
				return 4;
			else 
				return 0;
		}
		else
			return 1;
	else
		if (dt<0) 
			return 0;
		else 
			if (dt==0)
				return 3;
			else
				return 2;
}
void xuat(int kq)
{
	cout<<kq;
}
