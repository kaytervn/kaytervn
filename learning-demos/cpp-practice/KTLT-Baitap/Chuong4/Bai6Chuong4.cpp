#include<iostream>
using namespace std;
int fibo(int n);
void nhap(int &n);
void xuat(int a);

int main()
{
	int n;
	nhap(n);
	int kq=fibo(n);
	xuat(kq);
	return 0;
}

int fibo(int n)
{
	if(n==0||n==1)
		return 1;
	else
		return fibo(n-1)+fibo(n-2);
}

void nhap(int &n)
{
	cin>>n;
}

void xuat(int a)
{
	cout<<a;
}
