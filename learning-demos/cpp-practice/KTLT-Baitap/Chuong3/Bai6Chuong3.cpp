#include<iostream>
using namespace std;

void nhap(int &n, int &x);
double tinhTong(int n, int x);
void xuat(double a);

int main()
{
	int n,x;
	nhap(n,x);
	double kq=tinhTong(n,x);
	xuat(kq);
	
	return 0;
}

void nhap(int &n, int &x)
{
	cin>>n>>x;
}

int tinhXmuP(int x, int p)
{
	int t=1;
	
	for(int i=0;i<p;i++)
		t *=x;
	return t;
}

double tinhTong(int n, int x)
{
	double s=1;
	int mu;
	int p=1;
	for(int i=1;i<=n;i++)
	{
		p*=i;
		mu=tinhXmuP(x,i);
		s+=(double)mu/p;
	}
	return s;
}

void xuat(double a)
{
	cout<<a;
}
