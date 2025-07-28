#include<iostream>
void nhap(int &n, int A[]);
void xoaViTriK(int &n,int k, int A[]);
void xoaTatCaPTtrung(int &nA, int A[]);
void xuat(int n, int A[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE];
	int nA;
	nhap(nA,A);
	xoaTatCaPTtrung(nA,A);
	xuat(nA,A);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void xoaViTriK(int &n,int k, int A[])
{
	for(int i=k+1;i<n;i++)
		A[i-1]=A[i];
	n--;
}

void xoaTatCaPTtrung(int &nA, int A[])
{
	for(int i=0;i<nA;i++)
	{
		int co=0;
		for(int j=i+1;j<nA;j++)
			if(A[i]==A[j])
			{
				xoaViTriK(nA,j,A);
				j--;
				co=1;
			}
		if(co==1)
			xoaViTriK(nA,i,A);
	}
}

void xuat(int n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
