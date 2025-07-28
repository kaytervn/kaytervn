#include<iostream>
void nhap(int &n, int A[], int B[]);
void ghepMangXenKe(int n, int A[], int B[], int &nC, int C[]);
void xuat(int nC, int C[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE], C[2*SIZE];
	int n,nC;
	nhap(n,A,B);
	ghepMangXenKe(n,A,B,nC,C);
	xuat(nC,C);
	return 0;
}

void nhap(int &n, int A[], int B[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
	for(int i=0;i<n;i++)
		cin>>B[i];
}

void ghepMangXenKe(int n, int A[], int B[], int &nC, int C[])
{
	int iA=0;
	int iB=0;
	nC=0;
	while(iA<n)
	{
		C[nC++]=A[iA++];
		C[nC++]=B[iB++];
	}
}

void xuat(int nC, int C[])
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
}
