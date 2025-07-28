#include<iostream>
using namespace std;

void nhap(unsigned long long &n);
double tinhTong(unsigned long long n);
void xuat(double a);

int main()
{
	unsigned long long n;
	nhap(n);
	double kq=tinhTong(n);
	xuat(kq);
	
	return 0;
}

void nhap(unsigned long long &n)
{
	cin>>n;
}

double tinhTong(unsigned long long n)
{
	double s=0;
	unsigned long long p=0;
	for(int i=1;i<n+1;i++)
	{
		p+=i;
		s+=(double)1/p;
	}
	return s;
}

void xuat(double a)
{
	cout<<a;
}
