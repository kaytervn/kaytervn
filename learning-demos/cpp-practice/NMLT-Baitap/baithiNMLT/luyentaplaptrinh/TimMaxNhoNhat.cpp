#include<iostream>
using namespace std;

void nhap(int A[100][100], int &m, int &n);
int timMaxNhoNhatMoiDong(int A[100][100], int m, int n);
int timMaxDong(int A[100][100], int m, int n, int dong);
int timMin(int A[], int n);
void xuat(int n);


int main()
{
	int n, m, A[100][100];
	nhap(A,m,n);	
	int kq=timMaxNhoNhatMoiDong(A,m,n);
	xuat(kq);
	return 0;
}

void nhap(int A[100][100], int &m, int &n)
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

int timMaxNhoNhatMoiDong(int A[100][100], int m, int n)
{
	int B[100];
	for(int i=0;i<m;i++)
		B[i]=timMaxDong(A,m,n,i);
	int min=timMin(B,m);
	return min;
}

int timMaxDong(int A[100][100], int m, int n, int dong)
{
	int max=A[dong][0];
	for(int j=0;j<n;j++)
		if(A[dong][j]>max)
			max=A[dong][j];
	return max;
}

int timMin(int A[], int n)
{
	int min=A[0];
	for(int i=0;i<n;i++)
		if(A[i]<min)
			min=A[i];
	return min;
}
