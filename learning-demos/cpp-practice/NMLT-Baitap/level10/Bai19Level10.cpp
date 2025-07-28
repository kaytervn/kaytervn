#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[][SIZE], int &m, int &n, int &k);
void xuat(int a);
bool ktDongKGiam(int A[][SIZE], int m, int n, int k);

int main()
{
	int n, m, k, A[SIZE][SIZE];
	nhap(A,m,n,k);
	bool kq=ktDongKGiam(A,m,n,k);
	xuat(kq);
	return 0;
}

bool ktDongKGiam(int A[][SIZE], int m, int n, int k)
{
	for(int j=0;j<n-1;j++)
		if(A[k][j]<A[k][j+1])
			return 0;
	return 1;
}

void nhap(int A[][SIZE], int &m, int &n, int &k)
{
	cin>>m>>n>>k;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

void xuat(int a)
{
	if(a==1)
		cout<<"GIAM";
	else
		cout<<"KHONG GIAM";
}
