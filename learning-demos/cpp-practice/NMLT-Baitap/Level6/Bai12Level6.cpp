#include<iostream>
void nhap(int &n,int &x, int A[]);
int checkViTriXDauTien(int n,int x, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,x, A[1000];
	nhap (n,x,A);
	int kq=checkViTriXDauTien(n,x, A);
	xuat (kq);
	return 0;
}

void nhap(int &n,int &x, int A[])
{
	cin>>n>>x;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int checkViTriXDauTien(int n,int x, int A[])
{
	for(int i=0; i<n; i++)
		if(A[i]==x)
			return i;
	return -1;
}

void xuat(int kq)
{
	cout<<kq;
}
