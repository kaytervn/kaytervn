#include<iostream>
void nhap(int &n, int A[]);
int tinhTongSoChan(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	int kq=tinhTongSoChan(n, A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int tinhTongSoChan(int n, int A[])
{
	if(n>0)
	{
		int t=0;
		for(int i=0; i<n; i++)
			if(A[i]%2==0)
				t += A[i];
		return t;
	}
	return 0;
}

void xuat(int kq)
{
	cout<<kq;
}
