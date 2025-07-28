#include<iostream>
#include<cmath>
void nhap(int &n, int A[]);
void GTlonHonABSsau(int nA, int A[], int &nB, int B[]);
void xuat(int nC, int C[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE];
	int nA,nB;
	nhap(nA,A);
	GTlonHonABSsau(nA,A,nB,B);
	xuat(nB,B);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void GTlonHonABSsau(int nA, int A[], int &nB, int B[])
{
	nB=0;
	for(int i=0;i<nA-1;i++) // khong lay GT cuoi
			if(A[i]> abs(A[i+1]) )
				B[nB++]=A[i];
}

void xuat(int nC, int C[])
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
}
