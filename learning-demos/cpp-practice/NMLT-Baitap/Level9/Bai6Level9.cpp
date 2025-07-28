#include<iostream>
void nhap(int &n, int A[]);
int tongCucTri(int nA, int A[]);
void xuat(int n);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE];
	int nA;
	nhap(nA,A);
	int kq=tongCucTri(nA,A);
	xuat(kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int tongCucTri(int nA, int A[])
{
	int s=0;
	for(int i=1;i<nA-1;i++)
		if(A[i]<A[i-1]&&A[i]<A[i+1] || A[i]>A[i-1]&&A[i]>A[i+1])
			s += A[i];
	return s;
}

void xuat(int n)
{
	cout<<n;
}
