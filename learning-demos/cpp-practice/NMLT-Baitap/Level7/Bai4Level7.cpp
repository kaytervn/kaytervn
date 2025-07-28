#include<iostream>
#include<cmath>
void nhap(int &n,int A[]);
int tbcSHH(int n, int A[]);
int lamTron(double a);
bool kiemTraSoHoanHao(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[10000];
	nhap(n,A);
	int kq=tbcSHH(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int tbcSHH(int n, int A[])
{
	int s=0;
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoHoanHao(A[i])==1)
		{
			s=s+A[i];
			dem++;
		}
	}
	if(dem!=0)
		return lamTron((double)s/dem);
	else
		return 0;
}

int lamTron(double a)
{
	a=abs(a);
	int h;
		if ((a-int(a))>=0.5)
			h=int(a)+1;
		else h=int(a);
	return h;
}

bool kiemTraSoHoanHao(int n)
{
	int s=0;
	for(int i=1; i<= n/2; i++)
	{
		if (n%i == 0)
			s+= i;
	}
	if (s==n)
		return 1;
	else
		return 0;
}

void xuat(int kq)
{
	cout<<kq;
}
