#include<iostream>
void nhap(int &n, double A[]);
void ptChiXHtrongA(double A[], int nA, double B[], int nB, double C[], int &nC);
bool timThay(double A[], int n, double x);
void xuat(int nC, double C[]);
using namespace std;
#define SIZE 1000

int main()
{
	double A[SIZE], B[SIZE], C[SIZE];
	int nA,nB,nC;
	nhap(nA,A);
	nhap(nB,B);
	ptChiXHtrongA(A,nA,B,nB,C,nC);
	xuat(nC,C);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void ptChiXHtrongA(double A[], int nA, double B[], int nB, double C[], int &nC)
{
	nC=0;
	for(int i=0;i<nA;i++)
	{
		if(timThay(B,nB,A[i])==0)
			C[nC++]=A[i];
	}
}

bool timThay(double A[], int n, double x)
{
	for(int i=0;i<n;i++)
	{
		if(A[i]==x)
			return 1;
	}
	return 0;
}

void xuat(int nC, double C[])
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
}
