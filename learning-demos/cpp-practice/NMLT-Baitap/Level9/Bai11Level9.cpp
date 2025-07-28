#include<iostream>
void nhap(int &n, int A[]);
bool checkAlaConB(int nA, int A[], int nB, int B[]);
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
	bool kq=checkAlaConB(nA,A,nB,B);
	xuat(kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

bool checkAlaConB(int nA, int A[], int nB, int B[])
{
	for(int i=0;i<nA;i++)
	{
		if(timThay(B,nB,A[i])==0)
			return 0;
	}
	return 1;
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
	if(n)
		cout<<"A nam trong B";
	else
		cout<<"A KHONG nam trong B";
}
