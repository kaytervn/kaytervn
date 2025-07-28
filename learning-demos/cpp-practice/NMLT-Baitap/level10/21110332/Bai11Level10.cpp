#include<iostream>
#define SIZE 100
using namespace std;

void tong2MT(int A[][SIZE], int B[][SIZE], int m, int n, int T[][SIZE]);
void nhap(int &m, int &n);
void nhapMT(int A[][SIZE], int m, int n);
void xuat(int A[][SIZE], int m, int n);

int main()
{
	int m, n, A[SIZE][SIZE], B[SIZE][SIZE], T[SIZE][SIZE];
	nhap(m,n);
	nhapMT(A,m,n);
	nhapMT(B,m,n);	
	tong2MT(A,B,m,n,T);
	xuat(T,m,n);
	return 0;
}

void tong2MT(int A[][SIZE], int B[][SIZE], int m, int n, int T[][SIZE])
{
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			T[i][j]= A[i][j] + B[i][j];
}

void nhap(int &m, int &n)
{
	cin>>m>>n;
}

void nhapMT(int A[][SIZE], int m, int n)
{
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
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
