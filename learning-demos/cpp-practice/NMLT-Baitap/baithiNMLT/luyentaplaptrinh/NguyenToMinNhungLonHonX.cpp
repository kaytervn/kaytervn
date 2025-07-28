#include<iostream>
#include<cmath>
using namespace std;
void xuat(int n);
void nhap(int A[], int &n, int &x);
int lkSNT(int A[], int n, int x);
bool ktSNT(int n);
int main()
{
	int A[1000], n, x;
	nhap(A,n,x);
	int kq= lkSNT(A,n,x);
	xuat(kq);
}

void nhap(int A[], int &n, int &x)
{
	cin>>n>>x;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int lkSNT(int A[], int n, int x)
{
	int min=0;
	for(int i=0;i<n;i++)
		if(ktSNT(A[i])==1 && A[i]>x)
			min=A[i];
	for(int i=0;i<n;i++)
		if(ktSNT(A[i])==1 && A[i]<min && A[i]>x)
			min=A[i];
	return min;
}

bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
	{
		if(n%i == 0)
			return 0;
	}
	return 1;
}

void xuat(int n)
{
	cout<<n;
}
