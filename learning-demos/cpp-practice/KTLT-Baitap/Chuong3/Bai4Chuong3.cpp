#include<iostream>
using namespace std;

void nhap(int &n);
int tinhTong(int n);
void xuat(int a);

int main()
{
	int n;
	nhap(n);
	int kq=tinhTong(n);
	xuat(kq);
	
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

int tinhTong(int n)
{
	int s=0;
	int p=1;
	for(int i=1;i<=n;i++)
	{
		p*=i;
		s+=p;
	}
	return s;
}

void xuat(int a)
{
	cout<<a;
}
