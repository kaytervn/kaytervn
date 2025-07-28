#include<iostream>
#include<iomanip>
#define SIZE 100
using namespace std;

void nhap(int &n);
void datSoDem(int A[][SIZE], int n, int x, int y, int &soDem);
void duaSoDemVaoDoiDien(int A[][SIZE], int n);
void lapMaPhuong(int A[][SIZE], int n);
void xuat(int A[][SIZE], int n);

int main()
{
	int n, A[SIZE][SIZE]={0};
	nhap(n);
	lapMaPhuong(A,n);
	xuat(A,n);
	return 0;
}

void nhap(int &n)
{
	n=2;
	while(n%2==0)
		cin>>n;
}

void datSoDem(int A[][SIZE], int n, int x, int y, int &soDem)
{
	int X[SIZE], Y[SIZE];
	int s1=0;
	int s2=0;
	
	for(int i=0;i<=(n*2-2)/2;i++)
	{
		X[i]=s1;
		s1--;
	}
	
	for(int j=0;j<=(n*2-2)/2;j++)
	{
		Y[j]=s2;
		s2++;
	}
	
	for(int k=0;k<=(n*2-2)/2;k++)
	{
		A[x+X[k]][y+Y[k]]=soDem;
		soDem++;
	}
}

void duaSoDemVaoDoiDien(int A[][SIZE], int n)
{
	for(int i=0;i<(n-1)/2;i++)
	{
		for(int j=0;j<=(n*2-2);j++)
			if(A[i][j]!=0)
				A[i+n][j]=A[i][j];
	}
	
	for(int i=n+(n-1)/2;i<=(n*2-2);i++)
	{
		for(int j=0;j<=(n*2-2);j++)
			if(A[i][j]!=0)
				A[i-n][j]=A[i][j];
	}
	
	for(int i=0;i<=(n*2-2);i++)
	{
		for(int j=0;j<(n-1)/2;j++)
			if(A[i][j]!=0)
				A[i][j+n]=A[i][j];
	}
	
	for(int i=0;i<=(n*2-2);i++)
	{
		for(int j=n+(n-1)/2;j<=(n*2-2);j++)
			if(A[i][j]!=0)
				A[i][j-n]=A[i][j];
	}
}

void lapMaPhuong(int A[][SIZE], int n)
{
	int x=(n*2-2)/2;
	int y=0;
	int soDem=1;
	
	for(int k=0;k<=(n*2-2)/2;k++)
		datSoDem(A,n,x+k,y+k,soDem);
		
	duaSoDemVaoDoiDien(A,n);
}

void xuat(int A[][SIZE], int n)
{
	for(int i=(n-1)/2;i<n+(n-1)/2;i++)
	{
		for(int j=(n-1)/2;j<n+(n-1)/2;j++)
		{
			cout<<setw(3);
			cout<<A[i][j]<<" ";
		}
		cout<<endl<<endl;
	}
}
