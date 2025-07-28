#include<iostream>
void nhap(int &n, int A[]);
double tinhTBC(int n, int A[]);
void xuat(double kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	double kq=tinhTBC(n, A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double tinhTBC(int n, int A[])
{
	if(n>0)
	{
		double k=0;
		for(int i=0;i<n;i++)
			k += A[i];
		return k/n;
	}
	else
		return 0;
}

void xuat(double kq)
{
	cout<<kq;
}
