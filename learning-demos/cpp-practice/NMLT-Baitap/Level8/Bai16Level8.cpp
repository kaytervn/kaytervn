#include<iostream>
#include<cmath>
void nhap(int &n,int &k, int &x, int A[]);
void ganMang(int n, int A[], int B[], int &nB);
void xoaViTriK(int &n,int k, int A[]);
void chenXvaoK(int &n,int k, int x, int A[]);
void chenXsauK(int &n, int k, int x, int A[]);
void xuat(int &n, int A[]);
using namespace std;

int main()
{
	int nA,nB,k,x, A[1000], B[1000];
	nhap (nA,k,x,A);
	ganMang(nA,A,B,nB);
	xoaViTriK(nA,k,A);
	chenXsauK(nB,k,x,B);
	xuat(nA,A);
	xuat(nB,B);
	return 0;
}

void nhap(int &n,int &k, int &x, int A[])
{
	cin>>n>>k>>x;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

void ganMang(int n, int A[], int B[], int &nB)
{
	nB=n;
	for(int i=0;i<n;i++)
		B[i]=A[i];
}

void xoaViTriK(int &n,int k, int A[])
{
	for(int i=k+1;i<n;i++)
		A[i-1]=A[i];
	n--;
}

void chenXsauK(int &n, int k, int x, int A[])
{
	chenXvaoK(n,k+1,x,A);
}

void chenXvaoK(int &n,int k, int x, int A[])
{
	for(int i=n-1;i>=k;i--)
		A[i+1]=A[i];
	A[k]=x;
	n++;
}

void xuat(int &n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
	cout<<endl;
}
