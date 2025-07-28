#include<iostream>
#include<cmath>
void nhap(int &n, int &x, int A[]);
int viTriLonHonXdau(int n,int x, int A[]);
void chenX(int &n,int x, int A[]);
void xuat(int n, int A[]);
using namespace std;

int main()
{
	int n, A[1000],x;
	nhap(n,x,A);
	chenX(n,x,A);
	xuat(n,A);
	return 0;
}

void nhap(int &n, int &x, int A[])
{
	cin>>n>>x;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int viTriLonHonXdau(int n,int x, int A[])
{
	for(int i=0;i<n;i++)
		if(A[i]>x)
			return i;
	return n;
}

void chenX(int &n,int x, int A[])
{
	int k=viTriLonHonXdau(n,x,A);
	for(int i=n-1;i>=k;i--)
		A[i+1]=A[i];
	A[k]=x;
	n++;
}

void xuat(int n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
