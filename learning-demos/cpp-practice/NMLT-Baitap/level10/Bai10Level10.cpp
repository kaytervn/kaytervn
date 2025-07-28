#include<iostream>
#define SIZE 100
using namespace std;

int tongMang2chieu(int A[][SIZE], int m, int n);
void nhap(int A[][SIZE], int &m, int &n);
void xuat(int n);

int main()
{
	int n, m, A[SIZE][SIZE];
	nhap(A,m,n);	
	int kq=tongMang2chieu(A,m,n);
	xuat(kq);
	return 0;
}

int tongMang2chieu(int A[][SIZE], int m, int n)
{
	int s=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			s += A[i][j];
	return s;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];	
}

void xuat(int n)
{
	cout<<n;
}
