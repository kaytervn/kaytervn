#include<iostream>
#define SIZE 100
using namespace std;

bool laDiemLoi(int A[][SIZE], int i, int j);
void taoDuongVien(int A[][SIZE], int m, int n);
void nhap(int A[][SIZE], int &m, int &n);
void timDiemLoiMin(int A[][SIZE], int m, int n, int B[], int D[], int C[]);
void xuat(int D[], int C[], int p);

int main()
{
	int m,n,A[100][100],B[1000],D[1000],C[1000];
	nhap(A,m,n);
	taoDuongVien(A,m,n);
	timDiemLoiMin(A,m,n,B,D,C);

	return 0;	
}

bool laDiemLoi(int A[][SIZE], int i, int j)
{
	int X[4]={0,0,-1,1};
	int Y[4]={1,-1,0,0};
	
	for(int k=0;k<4;k++)
		if(A[i][j]<=A[i+X[k]][j+Y[k]])
			return 0;
	return 1;
}

void taoDuongVien(int A[][SIZE], int m, int n)
{
	for(int j=0;j<n+2;j++)
	{
		A[0][j]=INT_MIN;
		A[m+1][j]=INT_MIN;
	}
			
	for(int i=1;i<m+1;i++)
	{
		A[i][0]=INT_MIN;
		A[i][n+1]=INT_MIN;
	}
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=1;i<m+1;i++)
		for(int j=1;j<n+1;j++)
			cin>>A[i][j];
}

void timDiemLoiMin(int A[][SIZE], int m, int n, int B[], int D[], int C[])
{
	int nB=0;
	for(int i=1;i<m+1;i++)
		for(int j=1;j<n+1;j++)
		{
			if(laDiemLoi(A,i,j)==1)
			{
				B[nB]=A[i][j];
				D[nB]=i;
				C[nB]=j;
				nB++;
			}
		}
	
	int p=-1;
	int min=INT_MAX;

	for(int i=0;i<nB;i++)
		if(B[i]<min)
		{
			min=B[i];
			p=i;
		}
		
	xuat(D,C,p);
}

void xuat(int D[], int C[], int p)
{
	if(p==-1)
		cout<<p;
	else
		cout<<D[p]-1<<" "<<C[p]-1;
}
