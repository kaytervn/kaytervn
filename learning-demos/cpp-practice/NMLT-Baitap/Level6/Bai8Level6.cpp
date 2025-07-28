#include<iostream>
void nhap(int &n, int A[]);
int kiemTraGiaTri0(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	int kq=kiemTraGiaTri0(n, A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int kiemTraGiaTri0(int n, int A[])
{
	for(int i=0; i<n; i++)
		if(A[i]==0)
			return 1;
	return 0;
}

void xuat(int kq)
{
	cout<<kq;
}
