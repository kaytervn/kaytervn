#include<iostream>
void nhap(int &n, int A[]);
void ptChiXH1trong2mang(int A[], int nA, int B[], int nB, int C[], int &nC);
void ptChiXHtrongA(int A[], int nA, int B[], int nB, int C[], int &nC);
bool timThay(int A[], int n, int x);
void xuat(int n, int A[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE], C[2*SIZE];
	int nA,nB,nC;
	nhap(nA,A);
	nhap(nB,B);
	ptChiXH1trong2mang(A,nA,B,nB,C,nC);
	xuat(nC,C);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void ptChiXH1trong2mang(int A[], int nA, int B[], int nB, int C[], int &nC)
{
	nC=0;
	ptChiXHtrongA(A,nA,B,nB,C,nC);
	ptChiXHtrongA(B,nB,A,nA,C,nC);
}

void ptChiXHtrongA(int A[], int nA, int B[], int nB, int C[], int &nC)
{
	for(int i=0;i<nA;i++)
	{
		if(timThay(B,nB,A[i])==0)
			C[nC++]=A[i];
	}
}

bool timThay(int A[], int n, int x)
{
	for(int i=0;i<n;i++)
	{
		if(A[i]==x)
			return 1;
	}
	return 0;
}

void xuat(int n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
