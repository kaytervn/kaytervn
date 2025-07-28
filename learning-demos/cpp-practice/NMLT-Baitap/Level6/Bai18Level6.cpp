#include<iostream>
using namespace std;
void nhap(int &n, int A[]);
void daoNguocMang(int n, int A[]);
void hoanDoi(int&a,int &b);
void xuat(int n,int A[]);

int main()
{
	int n, A[1000];
	nhap(n, A);
	daoNguocMang(n,A);
	xuat(n,A);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

void daoNguocMang(int n, int A[])
{
	int x=0;
	int y=n-1;
	while(x<y)
	{
		hoanDoi(A[x], A[y]);
		x++;
		y--;
	}
}

void hoanDoi(int&a,int &b)
{
	int t=a;
	a=b;
	b=t;
}

void xuat(int n,int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
