#include<iostream>
void nhap(int &n, int A[]);
int demSoAm(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	int kq=demSoAm(n, A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int demSoAm(int n, int A[])
{
	int dem=0;
	for(int i=0; i<n; i++)
		if(A[i]<0)
			dem++;
	return dem;
}

void xuat(int kq)
{
	cout<<kq;
}
