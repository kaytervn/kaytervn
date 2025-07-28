#include<iostream>
void nhap(int &n, int A[]);
int demPTchiXH1trong2Mang(int A[], int nA, int B[], int nB);
int demPTchiXHtrongA(int B[], int nB, int A[], int nA);
bool timThay(int A[], int n, int x);
void xuat(int n);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE];
	int nA,nB;
	nhap(nA,A);
	nhap(nB,B);
	int kq=demPTchiXH1trong2Mang(B,nB,A,nA);
	xuat(kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int demPTchiXH1trong2Mang(int A[], int nA, int B[], int nB)
{
	int dem1=demPTchiXHtrongA(A,nA,B,nB);
	int dem2=demPTchiXHtrongA(B,nB,A,nA);
	return dem1+dem2;
}

int demPTchiXHtrongA(int A[], int nA, int B[], int nB)
{
	int dem=0;
	for(int i=0;i<nA;i++)
	{
		if(timThay(B,nB,A[i])==0)
			dem++;
	}
	return dem;
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

void xuat(int n)
{
	cout<<n;
}
