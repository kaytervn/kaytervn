#include<iostream>
using namespace std;

void nhap(int &x, int &p);
int tinhXmuP(int x, int p);
void xuat(int a);

int main()
{
	int x,p;
	nhap(x,p);
	int kq=tinhXmuP(x,p);
	xuat(kq);
	
	return 0;
}

void nhap(int &x, int &p)
{
	cin>>x>>p;
}

int tinhXmuP(int x, int p)
{
	if(p==1)
		return x;
	else
		return x*tinhXmuP(x,p-1);
}

void xuat(int a)
{
	cout<<a;
}
