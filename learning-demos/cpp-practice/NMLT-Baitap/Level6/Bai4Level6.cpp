#include<iostream>
void nhap(int &n, int A[]);
double tinhTBCsoChia5(int n, int A[]);
void xuat(double kq);
using namespace std;

int main()
{
	int n, A[30000];
	nhap (n,A);
	double kq=tinhTBCsoChia5(n, A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double tinhTBCsoChia5(int n, int A[])
{
	double t;
	int k=0;
	int dem=0;
	for(int i=0;i<n;i++)
		if(A[i]%5==0)
			{
				k += A[i];
				dem++;
			}
	if(dem != 0)
		t=(double)k/dem;
	return (int)t;
}

void xuat(double kq)
{
	cout<<kq;
}
