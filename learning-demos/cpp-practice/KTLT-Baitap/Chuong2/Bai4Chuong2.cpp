#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[][SIZE], int &m, int &n);
void mang2thanh1chieu(int A[][SIZE], int m, int n, int B[]);
void xuat(int B[], int n);

int main()
{
	int n, m, A[SIZE][SIZE], B[SIZE*SIZE];
	nhap(A,m,n);
	mang2thanh1chieu(A,m,n,B);
	xuat(B,m*n);
	return 0;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

void mang2thanh1chieu(int A[][SIZE], int m, int n, int B[])
{
	int nB=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			B[nB++]=A[i][j];
}

void xuat(int B[], int n)
{
	for(int i=0;i<n;i++)
		cout<<B[i]<<" ";
}
