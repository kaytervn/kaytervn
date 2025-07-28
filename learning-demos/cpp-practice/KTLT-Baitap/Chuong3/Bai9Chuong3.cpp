#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[], int &n, int &x);
void hoanDoi(int &a, int &b);
void sapXepGiamDan(int A[], int n);
void xuat(int A[], int n);
void chenXvaoK(int A[], int &n, int x, int k);
int chenXgiamDan(int A[], int &n, int x);
int viTriNhoHonXdau(int A[], int n, int x);

int main()
{
	int A[SIZE],n,x;
	nhap(A,n,x);
	sapXepGiamDan(A,n);
	chenXgiamDan(A,n,x);
	xuat(A,n);
	return 0;
}

void nhap(int A[], int &n, int &x)
{
	cin>>n>>x;
	
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void chenXvaoK(int A[], int &n, int x, int k)
{
	for(int i=n;i>k;i--)
	{
		A[i]=A[i-1];
	}
	
	A[k]=x;
	n++;
}

int viTriNhoHonXdau(int A[], int n, int x)
{
	for(int i=0;i<n;i++)
		if(A[i]<x)
			return i;
	return n;
}

int chenXgiamDan(int A[], int &n, int x)
{
	int k=viTriNhoHonXdau(A,n,x);
	chenXvaoK(A,n,x,k);
}

void hoanDoi(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

void sapXepGiamDan(int A[], int n)
{
	for(int i=0;i<n;i++)
		for(int j=i+1;j<n;j++)
		{
			if(A[j]>A[i])
				hoanDoi(A[i], A[j]);
		}
}

void xuat(int A[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
