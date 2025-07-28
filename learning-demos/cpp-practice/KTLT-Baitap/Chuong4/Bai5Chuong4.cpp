#include<iostream>
using namespace std;

void nhap(int &k, int &n);
int toHop(int k, int n);
void xuat(int a);

int main()
{
	int n,k;
	nhap(k,n);
	int kq= toHop(k,n);
	xuat(kq);
	
	return 0;
}

void nhap(int &k, int &n)
{
	do
	{
		cin>>n>>k;
	} while(k>n);
}

int toHop(int k, int n)
{
	if(k==0||k==n)
		return 1;
	if(k==1)
		return n;
	else
		return toHop(k-1,n-1)+toHop(k,n-1);
}

void xuat(int a)
{
	cout<<a;
}
