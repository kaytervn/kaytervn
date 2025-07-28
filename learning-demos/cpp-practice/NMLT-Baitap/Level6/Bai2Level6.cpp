#include<iostream>
void nhap(int &n, double A[]);
double tinhTongMang(int n, double A[]);
void xuat(double kq);
using namespace std;

int main()
{
	int n; 
	double A[1000];
	nhap (n,A);
	double kq=tinhTongMang(n, A);
	xuat (kq);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double tinhTongMang(int n, double A[])
{
	double k=0;
	for(int i=0;i<n;i++)
		k += A[i];
	return k;
}

void xuat(double kq)
{
	cout<<kq;
}
