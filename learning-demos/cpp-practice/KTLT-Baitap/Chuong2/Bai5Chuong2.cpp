#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[], int &m, int &n);
void mang1thanh2chieu(int A[][SIZE], int m, int n, int B[]);
void xuat(int A[][SIZE], int m, int n);

int main()
{
	int n, m, A[SIZE*SIZE], B[SIZE][SIZE];
	nhap(A,m,n);
	mang1thanh2chieu(B,m,n,A);
	xuat(B,m,n);
	return 0;
}

void nhap(int A[], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m*n;i++)
		cin>>A[i];
}

void mang1thanh2chieu(int A[][SIZE], int m, int n, int B[])
{
	int nB=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			A[i][j]=B[nB++];
}

void xuat(int A[][SIZE], int m, int n)
{
	for(int i=0;i<m;i++)
	{
		for(int j=0;j<n;j++)
			cout<<A[i][j]<<" ";
		cout<<endl;
	}
}
