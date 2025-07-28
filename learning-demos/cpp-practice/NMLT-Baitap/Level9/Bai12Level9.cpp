#include<iostream>
void nhap(int &n, double A[]);
void xoaViTriK(int &n,int k, double A[]);
void xoaMax(int &nA, double A[]);
int timMax(int n, double A[]);
void xuat(int n, double A[]);
using namespace std;
#define SIZE 1000

int main()
{
	double A[SIZE];
	int nA;
	nhap(nA,A);
	xoaMax(nA,A);
	xuat(nA,A);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void xoaViTriK(int &n,int k, double A[])
{
	for(int i=k+1;i<n;i++)
		A[i-1]=A[i];
	n--;
}

void xoaMax(int &nA, double A[])
{
	double max=timMax(nA,A);
	for(int i=0;i<nA;i++)
		if(A[i]==max)
		{
			xoaViTriK(nA,i,A);
			i--;
		}
}

int timMax(int n, double A[])
{
	double max=A[0];
	for(int i=1; i<n; i++)
		if(A[i]>max)
			max=A[i];
	return max;
}

void xuat(int n, double A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
