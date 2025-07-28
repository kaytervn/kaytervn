#include<iostream>
using namespace std;
void nhap(int &a, int &b);
void xuat(int dt);
int dientich(int a, int b);
int main()
{
	int d, r;
	nhap(d, r);
	int dt=dientich(d, r);
	xuat(dt);
	return 0;
}
void nhap(int &a, int &b)
{
	cin>>a>>b;
}
void xuat(int dt)
{
	cout<<dt;
}
int dientich(int a, int b)
{
	int s=a*b;
	return s;
}
