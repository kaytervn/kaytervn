#include<iostream>
#define SIZE 100
void nhap(int &n);
int dayFibonacci(int a);
void xuat(int n);
using namespace std;

int main()
{
	int n, A[SIZE];
	nhap(n);
	int kq=dayFibonacci(n);
	xuat(kq);
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

int dayFibonacci(int n)
{
	if (n==0 || n==1) 
		return 1;
	else
		return dayFibonacci(n-2)+dayFibonacci(n-1);
}

void xuat(int n)
{
	cout<<n;
}
