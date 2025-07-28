#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[], int &n, int &x, int &k);
void suaKthanhX(int A[], int x, int k);
void chenXvaoK(int A[], int &n, int x, int k);
void xoaViTriK(int A[], int &n, int k);
void xuat(int A[], int n);
int timX(int A[], int n, int x);

int main()
{
	int A[SIZE],n,x,k;
	nhap(A,n,x,k);
//	suaKthanhX(A,x,k);
//	chenXvaoK(A,n,x,k);
	xoaViTriK(A,n,k);
//	timX(A,n,x);
	xuat(A,n);
	
	return 0;
}

int timX(int A[], int n, int x)
{
	for(int i=0;i<n;i++)
		if(A[i]==x)
			return i;
	return -1;
}

void nhap(int A[], int &n, int &x, int &k)
{
	cin>>n>>x>>k;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void suaKthanhX(int A[], int x, int k)
{
	A[k]=x;
}

void chenXvaoK(int A[], int &n, int x, int k)
{
	for(int i=n-1;i>=k;i--)
		A[i+1]=A[i];
	A[k]=x;
	n++;
}

void xoaViTriK(int A[], int &n, int k)
{
	for(int i=k;i<n-1;i++)
		A[i]=A[i+1];
	n--;
}

void xuat(int A[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
