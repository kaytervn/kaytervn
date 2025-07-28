#include<iostream>
#include <algorithm>
void nhap(float &a, float &b, float &c, float &d);
float check(float a, float b, float c, float d);
void xuat(float kq);
using namespace std;
int main()
{
	float a,b,c,d;
	nhap(a,b,c,d);
	float kq=check(a,b,c,d);
	xuat(kq);
	return 0;
}
void nhap(float &a, float &b, float &c, float &d)
{
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
	cout<<"Nhap c: "; cin>>c;
	cout<<"Nhap d: "; cin>>d;
}
float check(float a, float b, float c, float d)
{
	float max=a;
	if (b>max) max=b;
	if (c>max) max=c;
	if (d>max) max=d;
	return max;
}
void xuat(float kq)
{
	cout<<"Gia tri lon nhat: "<<kq;
}
