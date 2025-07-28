#include<iostream>
#include <cmath>

void nhap(long long &n);
long long viTriDayFibonacci(long long a);
void xuat(long long n);
using namespace std;

int main()
{
	long long n;
	nhap(n);
	long long k=viTriDayFibonacci(n);
	xuat(k);
	return 0;
}

void nhap(long long &n)
{
	cin>>n;
}

long long viTriDayFibonacci(long long n)
{
	long long fn;
	long long f1=1;
	long long f0=0;
	if (n==0 || n==1) 
		return n;
	else
		for(size_t i=2; i<=n; i++)
		{
			fn=f0+f1;
			f0=f1;
			f1=fn;
		}
	return fn;
}

void xuat(long long n)
{
	cout<<n;
}
