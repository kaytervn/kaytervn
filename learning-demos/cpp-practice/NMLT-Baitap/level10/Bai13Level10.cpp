#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[][SIZE], int &n);
void xuat(int A[][SIZE], int n);
void cheoChinhTangDan(int A[][SIZE], int n);
void hoanDoi(int &a, int &b);


int main()
{
	int n, A[SIZE][SIZE];
	nhap(A,n);
	cheoChinhTangDan(A,n);
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

void cheoChinhTangDan(int A[][SIZE], int n)
{
	for(int i=0;i<n-1;i++)
		if(A[i][i]>A[i+1][i+1])
			hoanDoi(A[i][i],A[i+1][i+1]);
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
