#include<iostream>
void nhap(int &n, int A[]);
void taoMangBmangC(int nA, int A[], int &nB, int B[], int &nC, int C[]);
void xuat(int nC, int C[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE], C[SIZE];
	int nA,nB,nC;
	nhap(nA,A);
	taoMangBmangC(nA,A,nB,B,nC,C);
	xuat(nB,B);
	xuat(nC,C);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void taoMangBmangC(int nA, int A[], int &nB, int B[], int &nC, int C[])
{
	int iA=0;
	nB=0;
	nC=0;
	while(iA<nA)
	{
		if(A[iA]>=0)
			B[nB++]=A[iA++];
		else
			C[nC++]=A[iA++];
	}
}

void xuat(int nC, int C[])
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
	cout<<endl;
}
