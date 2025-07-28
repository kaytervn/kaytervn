#include<iostream>
using namespace std;

void nhap(unsigned long long &n);
unsigned long long tinhTong(unsigned long long n);
void xuat(unsigned long long a);

int main()
{
	unsigned long long n;
	nhap(n);
	unsigned long long kq=tinhTong(n);
	xuat(kq);
	
	return 0;
}

void nhap(unsigned long long &n)
{
	cin>>n;
}

unsigned long long tinhTong(unsigned long long n)
{
	unsigned long long s=0;
	unsigned long long p=0;
	for(unsigned long long i=1;i<n+1;i++)
	{
		p+=i;
		s+=p;
	}
	return s;
}

void xuat(unsigned long long a)
{
	cout<<a;
}
