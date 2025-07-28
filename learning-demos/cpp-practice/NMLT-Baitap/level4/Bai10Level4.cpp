#include<iostream>
using namespace std;
void nhap(int &n);
void xuat(int n);
int main ()
{
	int n;
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
	if (n == 0 || n == 1)
		return n;
	else
		return dayFibonacci(n-1) + dayFibonacci(n-2);
}
void xuat(int n)
{
	for(int i=0; i<n; i++)
		cout<<dayFibonacci(i)<<" ";
}
