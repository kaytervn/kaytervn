#include<iostream>
void nhap(int &n, double A[]);
void traiDauLanCan(int nA, double A[], int &nB, double B[]);
void xuat(int nC, double C[]);
using namespace std;
#define SIZE 1000

int main()
{
	double A[SIZE], B[SIZE];
	int nA,nB;
	nhap(nA,A);
	traiDauLanCan(nA,A,nB,B);
	xuat(nB,B);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void traiDauLanCan(int nA, double A[], int &nB, double B[])
{
	nB=0;
	if(A[0]*A[1]<0)
		B[nB++]=A[0];
	for(int i=1;i<nA-1;i++)
			if(A[i]*A[i-1]<0 || A[i]*A[i+1]<0 )
				B[nB++]=A[i];
	if(A[nA-2]*A[nA-1]<0)
		B[nB++]=A[nA-1];
}

void xuat(int nC, double C[])
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
}
