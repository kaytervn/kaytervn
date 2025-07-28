#include<iostream>
using namespace std;
void nhap(int &n);
int rutTien(int n, int &a,int &b,int &c,int &d);
void xuat(int a,int b,int c,int d);
int main()
{
	int n,a,b,c,d;
	nhap(n);
	rutTien(n,a,b,c,d);
	xuat(a,b,c,d);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int rutTien(int n, int &a,int &b,int &c,int &d)
{
	int tmp=n;
	a =tmp/100000;
	tmp %=100000;
	b =tmp/50000;
	tmp %= 50000;
	c =tmp/20000;
	tmp %= 20000;
	d =tmp/10000;
}
void xuat(int a,int b,int c,int d)
{
	cout<<"So to 100 000 VND: "<<a<<endl;
	cout<<"So to 50 000 VND: "<<b<<endl;
	cout<<"So to 20 000 VND: "<<c<<endl;
	cout<<"So to 10 000 VND: "<<d<<endl;
}
