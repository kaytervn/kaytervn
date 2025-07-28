#include<iostream>
#define SIZE 100
using namespace std;

void mang2thanh1chieu(int A[][SIZE], int n, int B[]);
void mang1thanh2chieu(int A[][SIZE], int n, int B[]);
void sapXepTang(int A[], int n);
void hoanDoi(int &a, int &b);
void xuat(int A[][SIZE], int n);
void nhap(int A[][SIZE], int &n);

int main()
{
	int n, A[SIZE][SIZE], B[SIZE*SIZE];
	nhap(A,n);
	mang2thanh1chieu(A,n,B);
	sapXepTang(B,n*n);
	mang1thanh2chieu(A,n,B);
	xuat(A,n);
	return 0;
}

void nhap(int A[][SIZE], int &n)
{
	cin>>n;
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

void mang2thanh1chieu(int A[][SIZE], int n, int B[])
{
	int nB=0;
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			B[nB++]=A[i][j];
}

void mang1thanh2chieu(int A[][SIZE], int n, int B[])
{
	int nB=0;
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			A[i][j]=B[nB++];
}

void sapXepTang(int A[], int n)
{
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(A[i]>A[j])
				hoanDoi(A[i], A[j]);
}

void hoanDoi(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

void xuat(int A[][SIZE], int n)
{
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++)
			cout<<A[i][j]<<" ";
		cout<<endl;
	}
}
