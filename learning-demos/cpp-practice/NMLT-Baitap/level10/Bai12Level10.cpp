#include<iostream>
#define SIZE 100
using namespace std;

void tongDong(int A[][SIZE], int n, int D[]);
void nhap(int A[][SIZE], int &n);
void xuatMT(int A[], int n);
void xuat(int a);
void tongCot(int A[][SIZE], int n, int C[]);
int tongCheoChinh(int A[][SIZE], int n);
int tongCheoPhu(int A[][SIZE], int n);


int main()
{
	int n, A[SIZE][SIZE], D[SIZE], C[SIZE];
	nhap(A,n);
	
	tongDong(A,n,D);
	xuatMT(D,n);
	
	tongCot(A,n,C);
	xuatMT(C,n);

	int c=tongCheoChinh(A,n);
	xuat(c);

	int p=tongCheoPhu(A,n);
	xuat(p);

	return 0;
}

void tongDong(int A[][SIZE], int n, int D[])
{
	for(int i=0;i<n;i++)
	{
		int s=0;
		for(int j=0;j<n;j++)
			s +=A[i][j];
		D[i]= s;
	}
}

void tongCot(int A[][SIZE], int n, int C[])
{
	for(int i=0;i<n;i++)
	{
		int s=0;
		for(int j=0;j<n;j++)
			s +=A[j][i];
		C[i]= s;
	}
}

int tongCheoChinh(int A[][SIZE], int n)
{
	int s=0;
	for(int i=0;i<n;i++)
		s+=A[i][i];
	return s;
}

int tongCheoPhu(int A[][SIZE], int n)
{
	int s=0;
	for(int i=0;i<n;i++)
		s+=A[i][n-(i+1)];
	return s;
}

void nhap(int A[][SIZE], int &n)
{
	cin>>n;
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];	
}

void xuatMT(int A[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
	cout<<endl;
}

void xuat(int a)
{
	cout<<a<<endl;
}
