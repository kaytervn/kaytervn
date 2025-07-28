#include<iostream>
void nhap(int &n, int A[]);
int viTriMin(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	int kq=viTriMin(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int viTriMin(int n, int A[])
{
	int p=0;
	for(int i=1; i<n; i++)
		if(A[p]>A[i])
			p=i;
	return p;
}

void xuat(int kq)
{
	cout<<kq;
}
