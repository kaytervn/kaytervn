#include<iostream>
#include<cmath>
void nhap(int &n,int A[]);
int soNguyenToDauTien(int n, int A[]);
int kiemTraSoNguyenTo(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	int kq=soNguyenToDauTien(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int soNguyenToDauTien(int n, int A[])
{
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoNguyenTo(A[i])!=0)
			return A[i];
	}
	return -1;
}

int kiemTraSoNguyenTo(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}

void xuat(int kq)
{
	cout<<kq;
}
