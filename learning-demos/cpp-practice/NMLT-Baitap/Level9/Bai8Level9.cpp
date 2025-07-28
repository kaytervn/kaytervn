#include<iostream>
void nhap(int &n, int A[]);
void demSoTrung(int n, int A[], int &nB, int B[], int C[]);
int demSoLanXH(int A[], int n, int x);
void xuat(int A[], int B[], int n);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE], B[SIZE], C[SIZE];
	int nA,nB;
	nhap(nA,A);
	demSoTrung(nA,A,nB,B,C);
	xuat(B,C,nB);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void demSoTrung(int n, int A[], int &nB, int B[], int C[])
{
	nB=0;
	for(int i=0;i<n;i++)
		if(demSoLanXH(B,nB,A[i])==0)
			B[nB++]=A[i];
	for(int i=0;i<nB;i++)
		C[i]=demSoLanXH(A,n,B[i]);
}

int demSoLanXH(int A[], int n, int x)
{
	int dem=0;
	for(int i=0;i<n;i++)
		if(A[i]==x)
			dem++;
	return dem;
}

void xuat(int A[], int B[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" "<<B[i]<<endl;
}
