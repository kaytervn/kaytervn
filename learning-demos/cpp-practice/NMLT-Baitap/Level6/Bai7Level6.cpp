#include<iostream>
void nhap(int &n);
int dayFibonacci(int a);
void xuat(int n);
using namespace std;

int main()
{
	int n, A[1000];
	nhap(n);
	xuat(n);
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

int dayFibonacci(int n)
{
	int f1=1;
	int fn=1;
	if (n==0 || n==1)
		return n;
	else
		for(int i=2; i<n; i++)
		{
			int f0=f1;
			f1=fn;
			fn=f0+f1;
		}
	return fn;
}

void xuat(int n)
{
	for(int i=0; i<n; i++)
		cout<<dayFibonacci(i)<<" ";
}
