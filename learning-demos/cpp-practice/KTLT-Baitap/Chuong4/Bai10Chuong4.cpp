#include<iostream>
#define SIZE 10000
using namespace std;

void nhap(int &n, int A[]);
void demSoTrung(int n, int A[], int &nB, int B[], int C[]);
int demSoLanXH(int A[], int n, int x);
void xuat(int A[], int n);
int timMax(int A[], int n);
void nhungPhanTuXuatHienNhieuNhat(int B[], int C[], int nB);

int main()
{
	int A[SIZE], B[SIZE], C[SIZE];
	int nA,nB;
	nhap(nA,A);
	demSoTrung(nA,A,nB,B,C);
	nhungPhanTuXuatHienNhieuNhat(B,C,nB);
	return 0;
}

int timMax(int A[], int n)
{
	int max=A[0];
	for(int i=1;i<n;i++)
		if(A[i]>max)
			max=A[i];
	return max;
}

void nhungPhanTuXuatHienNhieuNhat(int B[], int C[], int nB)
{
	int A[SIZE],nA;
	
	int max=timMax(C,nB);
	
	for(int i=0;i<nB;i++)
	{
		if(C[i]==max)
			A[nA++]=B[i];
	}
	
	xuat(A,nA);
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

void xuat(int A[], int n)
{
	int min=A[0];
	for(int i=1;i<n;i++)
		if(A[i]<=min)
			min=A[i];
	cout<< min;
}
