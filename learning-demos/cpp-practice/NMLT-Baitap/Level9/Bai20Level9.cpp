#include<iostream>
void nhap(int &n, int A[]);
void ghepMangXenKe(int nA, int A[], int nB, int B[], int &nC, int C[]);
void xuat(int nC, int C[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE], C[2*SIZE];
	int nA,nB,nC;
	nhap(nA,A);
	nhap(nB,B);
	ghepMangXenKe(nA,A,nB,B,nC,C);
	xuat(nC,C);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void ghepMangXenKe(int nA, int A[], int nB, int B[], int &nC, int C[])
{
	int iA=0;
	int iB=0;
	nC=0;
	while(iA<nA && iB<nB)
	{
		C[nC++]=A[iA++];
		C[nC++]=B[iB++];
	}
	while(iA<nA)
		C[nC++]=A[iA++];
	while(iB<nB)
		C[nC++]=B[iB++];
}

void xuat(int nC, int C[])
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
}
