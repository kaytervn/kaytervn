#include<iostream>
#include<cmath>
void nhap(int &n,int A[]);
double tbcSNT(int n, int A[]);
int kiemTraSoNguyenTo(int n);
void xuat(double kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	double kq=tbcSNT(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double tbcSNT(int n, int A[])
{
	int k=0;
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoNguyenTo(A[i])!=0)
			{
				dem++;
				k += A[i];
			}
	}
	if(dem != 0)
		return (float)k/dem;
	return 0;
}

int kiemTraSoNguyenTo(int n)
{
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}

void xuat(double kq)
{
	cout<<kq;
}
