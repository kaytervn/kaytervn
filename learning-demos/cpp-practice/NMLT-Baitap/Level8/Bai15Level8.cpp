#include<iostream>
#include<cmath>
void nhap(int &n, double &x, double A[]);
double gtAmCuoiLonHonX(int n, double A[], double x);
void xuat(double kq);
using namespace std;

int main()
{
	int n;
	double A[1000],x;
	nhap (n,x,A);
	double kq=gtAmCuoiLonHonX(n,A,x);
	xuat (kq);
	return 0;
}

void nhap(int &n, double &x, double A[])
{
	cin>>n>>x;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double gtAmCuoiLonHonX(int n, double A[], double x)
{
	for(int i=n-1;i>0;i--)
		if(A[i]<0 && A[i]>x)
			return A[i];
	return 0;
}

void xuat(double kq)
{
	cout<<kq;
}
