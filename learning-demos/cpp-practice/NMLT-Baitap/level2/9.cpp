#include<iostream>
void nhap(int &a, int &b, int &c);
int nhoNhi(int a, int b, int c);
void xuat(int k);
using namespace std;
int main()
{
	int a,b,c;
	nhap(a,b,c);
	int k=nhoNhi(a,b,c);
	xuat(k);
	return 0;
}
void nhap(int &a, int &b, int &c)
{
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
	cout<<"Nhap c: "; cin>>c;
}
int nhoNhi(int a, int b, int c)
{
	if ((a>b && a<c)||(a>c && a<b))
		return a;
	else
		if ((b>c && b<a)||(b>a && b<c))
			return b;
		else 
			return c;
}
void xuat(int k)
{
	cout<<"So nho nhi la: "<<k;
}
