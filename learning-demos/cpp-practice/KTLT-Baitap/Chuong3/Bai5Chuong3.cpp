#include<iostream>
using namespace std;

void nhap(int &n);
double tinhTong(int n);
void xuat(double a);

int main()
{
	int n;
	nhap(n);
	double kq=tinhTong(n);
	xuat(kq);
	
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

double tinhTong(int n)
{
	double s=0;
	int p=1;
	for(int i=1;i<=n;i++)
	{
		p*=i;
		s+=(double)1/p;
	}
	return s;
}

void xuat(double a)
{
	cout<<a;
}
