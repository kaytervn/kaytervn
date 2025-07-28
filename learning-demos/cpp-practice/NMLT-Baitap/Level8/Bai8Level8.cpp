#include<iostream>
void nhap(int &n, double A[]);
double timSoAmMax(int n, double A[]);
void xuat(double kq);
using namespace std;

int main()
{
	int n;
	double A[1000];
	nhap (n,A);
	double kq=timSoAmMax(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double timSoAmMax(int n, double A[])
{
	double max=0;
	for(int i=0; i<n; i++)
		if(A[i]<0)
			max=A[i];
	for(int i=0; i<n; i++)
		if(A[i]<0 && A[i]>max)
			max=A[i];
	return max;
}

void xuat(double kq)
{
	cout<<kq;
}
