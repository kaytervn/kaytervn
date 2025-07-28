#include<iostream>
using namespace std;

void nhap(int A[][100], int &m, int &n, int &k);
void xuat(int n);
int timMaxMaTranSauKhiLoaiDongK(int A[100][100], int &m, int n, int k);
void xoaDongK(int A[100][100],int &m, int n, int k);


int main()
{
	int n, m, k, A[100][100];
	nhap(A,m,n,k);	
	int kq=timMaxMaTranSauKhiLoaiDongK(A,m,n,k);
	xuat(kq);
	return 0;
}

void nhap(int A[100][100], int &m, int &n, int &k)
{
	cin>>m>>n>>k;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];	
}

void xuat(int n)
{
	cout<<n;
}

int timMaxMaTranSauKhiLoaiDongK(int A[100][100], int &m, int n, int k)
{
	xoaDongK(A,m,n,k);
	int max=A[0][0];
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			if(A[i][j]>max)
				max=A[i][j];
	return max;
}

void xoaDongK(int A[100][100],int &m, int n, int k)
{
	for(int i=k;i<m-1;i++)
		for(int j=0;j<n;j++)
			A[i][j]=A[i+1][j];
	m--;
}
