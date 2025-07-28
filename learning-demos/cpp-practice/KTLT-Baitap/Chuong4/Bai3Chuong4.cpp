#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int &n);
void xuat(int a);
int giaiThua(int n);

int main()
{
	int n;
	nhap(n);
	int kq=giaiThua(n);
	xuat(kq);
	
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

void xuat(int a)
{
	cout<<a;
}

int giaiThua(int n)
{
	if(n==0)
		return 1;
	else
		return n*giaiThua(n-1);
}
