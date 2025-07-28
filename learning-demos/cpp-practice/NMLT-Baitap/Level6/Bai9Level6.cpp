#include<iostream>
void nhap(int &n,int &x, int A[]);
int tongLonHonX(int n,int x, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,x, A[1000];
	nhap (n,x,A);
	int kq=tongLonHonX(n,x, A);
	xuat (kq);
	return 0;
}

void nhap(int &n,int &x, int A[])
{
	cin>>n>>x;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int tongLonHonX(int n,int x, int A[])
{
	int t=0;
	for(int i=0; i<n; i++)
		if(A[i]>x)
			t += A[i];
	return t;
}

void xuat(int kq)
{
	cout<<kq;
}
