#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &a, int &b, int &c, int &d);
int tongPhanSo(int a, int b, int c, int d, int &tu, int &mau);
int dauTru(int &a, int &b);
bool hopLe(int b, int d);
void xuat(int tu, int mau, int kq);
int main()
{
	int a,b,c,d,tu,mau;
	nhap(a,b,c,d);
	int kq=tongPhanSo(a,b,c,d,tu,mau);
	xuat(tu,mau,kq);
	return 0;
}
void nhap(int &a, int &b, int &c, int &d)
{
	cin>>a>>b>>c>>d;
}
int uocChungLonNhat(int a, int b)
{
	int ucln;
	a=abs(a);
	b=abs(b);
	for(int i=1; i<= min(a,b); i++)
		if(a%i==0 && b%i==0)
			ucln=i;
	return ucln;
}
int tongPhanSo(int a, int b, int c, int d, int &tu, int &mau)
{
	if(hopLe(b,d)==1)
	{
		tu=a*d + c*b;
		mau=b*d;
		dauTru(tu,mau);
		int k=uocChungLonNhat(tu, mau);
		tu /= k; 
		mau /= k;
	}
	else
		return 0;
}
int dauTru(int &a, int &b)
{
	if(b<0)
	{
		a= -a;
		b= -b;
	}
	else
		if(a*b > 0)
		{
			a= abs(a);
			b= abs(b);
		}

}
bool hopLe(int b, int d)
{
	if(b==0 || d==0)
		return 0;
	else
		return 1;
}
void xuat(int tu, int mau, int kq)
{
	if(tu==0 || mau==1)
		cout<<tu;
	else
		if(kq==0)
			cout<<"Khong hop le";
		else
			cout<<tu<<"/"<<mau;
}
