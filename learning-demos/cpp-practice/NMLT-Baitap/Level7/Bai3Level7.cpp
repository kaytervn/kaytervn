#include<iostream>
#include<cmath>
void nhap(int &n,int A[]);
int soNguyenToCuoiCung(int n, int A[]);
int kiemTraSoNguyenTo(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	int kq=soNguyenToCuoiCung(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int soNguyenToCuoiCung(int n, int A[])
{
	int t=-1;
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoNguyenTo(A[i])!=0)
			t=A[i];
	}
	return t;
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
