#include<iostream>
void nhap(int &n, double A[]);
double checkSoAmXDauTien(int n, double A[]);
void xuat(double kq);
using namespace std;

int main()
{
	int n;
	double A[1000];
	nhap (n,A);
	double kq=checkSoAmXDauTien(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double checkSoAmXDauTien(int n, double A[])
{
	for(int i=0; i<n; i++)
		if(A[i]<0)
			return A[i];
	return 1;
}

void xuat(double kq)
{
	cout<<kq;
}
