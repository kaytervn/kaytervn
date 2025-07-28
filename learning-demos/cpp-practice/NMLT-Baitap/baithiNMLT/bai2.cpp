#include<iostream>
using namespace std;
#define SIZE 1000

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

void xoaPTtrung(int &nA, double A[])
{
	for(int i=0;i<nA;i++)
		for(int j=i+1;j<nA;j++)
			if(A[i]==A[j])
			{
				xoaViTriK(nA,j,A);
				j--;
			}
}

int main()
{
	double A[SIZE];
	int nA;
	nhap(nA,A);
	xoaPTtrung(nA,A);
	int dem=nA;
	cout<<dem;
	return 0;
}
