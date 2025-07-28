#include<iostream>
#define SIZE 100
using namespace std;

void xuat(int A[][SIZE], int m, int n);
void tich(int A[][SIZE], int B[][SIZE], int C[][SIZE], int m, int n, int k);
void nhap(int A[][SIZE], int &m, int &n);

int main()
{
	int A[SIZE][SIZE],B[SIZE][SIZE],C[SIZE][SIZE],am,an,bm,bn;
	nhap(A,am,an);
	nhap(B,bm,bn);
	if(an==bm)
	{
		tich(A,B,C,am,an,bn);
		xuat(C,am,bn);
	}
	else
	{
		cout<<"Khong nhan duoc!";
	}
	
	
	return 0;
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

void tich(int A[][SIZE], int B[][SIZE], int C[][SIZE], int m, int n, int k)
{
	for(int i=0;i<m;i++)
	{
		for(int j=0;j<k;j++)
		{
			for(int l=0;l<n;l++)
				C[i][j]+=A[i][l]*B[l][j];
		}
	}
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}
