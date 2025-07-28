#include<iostream>
void nhap(int &n, int &k, int A[]);
void xoaViTriK(int &n,int k, int A[]);
void chenXvaoK(int &n,int k, int x, int A[]);
void dichPhaiXoayVong(int &n, int k, int A[]);
void xuat(int n, int A[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE];
	int n,k;
	nhap(n,k,A);
	dichPhaiXoayVong(n,k,A);
	xuat(n,A);
	return 0;
}

void nhap(int &n, int &k, int A[])
{
	cin>>n>>k;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void xoaViTriK(int &n,int k, int A[])
{
	for(int i=k+1;i<n;i++)
		A[i-1]=A[i];
	n--;
}

void chenXvaoK(int &n,int k, int x, int A[])
{
	for(int i=n;i>k;i--)
		A[i]=A[i-1];
	A[k]=x;
	n++;
}

void dichPhaiXoayVong(int &n, int k, int A[])
{
	for(int i=0;i<k;i++)
	{
		int x=A[n-1];
		xoaViTriK(n,n-1,A);
		chenXvaoK(n,0,x,A);
	}
}

void xuat(int n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
