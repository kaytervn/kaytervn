#include<iostream>
#include<cmath>
void nhap(int &n, int A[]);
int demSNT(int n, int A[]);
bool checkSNT(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap (n,A);
	int kq=demSNT(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int demSNT(int n, int A[])
{
	int dem=0;
	for(int i=0; i<n; i++)
		if(checkSNT(A[i])!=0)
			dem++;
	return dem;
}

bool checkSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
	return 1;
}

void xuat(int kq)
{
	cout<<kq;
}
