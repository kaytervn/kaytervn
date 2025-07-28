#include<iostream>
void nhap(int &n, int A[]);
void xoaViTriK(int &n,int k, int A[]);
void xoaSCP(int &nA, int A[]);
bool kiemTraSoChinhPhuong(int n);
void xuat(int n, int A[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE];
	int nA;
	nhap(nA,A);
	xoaSCP(nA,A);
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

void xoaSCP(int &nA, int A[])
{
	for(int i=0;i<nA;i++)
		if(kiemTraSoChinhPhuong(A[i])==1)
		{
			xoaViTriK(nA,i,A);
			i--;
		}
}

bool kiemTraSoChinhPhuong(int n)
{
	int i=0;
	while(i*i <=n)
	{
		if(i*i==n)
			return 1;
		i++;
	}
	return 0;
}

void xuat(int n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
