#include<iostream>
#include <conio.h>
void nhap(int &n,int A[]);
int doiViTriMinMax(int n, int A[]);
int hoanDoi(int &a, int &b);
int pmax(int n, int A[]);
int pmin(int n, int A[]);
void xuat(int n);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	doiViTriMinMax(n,A);
	xuat;
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int doiViTriMinMax(int n, int A[])
{
	hoanDoi(A[pmax(n,A)],A[pmin(n,A)]);
	for(int i=0;i<n;i++)
	{
		xuat(A[i]);
	}
}

int hoanDoi(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

int pmax(int n, int A[])
{
	int max=A[0];
	int p=0;
	for(int i=0; i<n; i++)
		if(A[i]>max)
		{
			max=A[i];
			p=i;
		}
	return p;
}

int pmin(int n, int A[])
{
	int min=A[0];
	int p=0;
	for(int i=0; i<n; i++)
		if(A[i]<min)
		{
			min=A[i];
			p=i;
		}
	return p;
}

void xuat(int n)
{
	cout<<n<<" ";
}
