#include<iostream>
using namespace std;

void nhap(int A[100][100], int &m, int &n);
void xuat(int a);
int diemLoiMin(int A[100][100], int m, int n, int D[], int C[]);
int timViTriMin(int A[], int n);
bool laDiemLoi(int A[100][100], int i, int j);

int main()
{
	int n, m, A[100][100], D[10000], C[10000];
	nhap(A,m,n);
	int p=diemLoiMin(A,m,n,D,C);
	if(D[p]==0 || C[p]==0)
		xuat(-1);
	else
	{
		xuat(D[p]-1);
		xuat(C[p]-1);
	}
	return 0;
}

void nhap(int A[100][100], int &m, int &n)
{
	cin>>m>>n;
	
	for(int j=0;j<n;j++)
	{
		A[0][j]=0;
		A[m-1][j]=0;
	}
			
	for(int i=1;i<m-1;i++)
	{
		A[i][0]=0;
		A[i][n-1]=0;
	}
	
	for(int i=1;i<m+1;i++)
		for(int j=1;j<n+1;j++)
			cin>>A[i][j];	
}

int diemLoiMin(int A[100][100], int m, int n, int D[], int C[])
{
	int B[10000],nB;
	nB=0;
	for(int i=1;i<m+1;i++)
		for(int j=1;j<n+1;j++)
			if(laDiemLoi(A,i,j))
			{
				B[nB]=A[i][j];
				D[nB]=i;
				C[nB]=j;
				nB++;
			}
	int p=timViTriMin(B,nB);
	return p;
}

int timViTriMin(int A[], int n)
{
	int min=A[0];
	int p=0;
	for(int i=1;i<n;i++)
		if(A[i]<min)
		{
			min=A[i];
			p=i;
		}
	return p;
}

bool laDiemLoi(int A[100][100], int i, int j)
{
	int X[4]={0,0,1,-1};
	int Y[4]={-1,1,0,0};
	for(int k=0;k<4;k++)
		if(A[i][j]<=A[i+X[k]][j+Y[k]])
			return 0;
	return 1;
}

void xuat(int a)
{
	cout<<a<<" ";
}
