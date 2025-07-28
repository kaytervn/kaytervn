#include<iostream>
#include<cmath>
using namespace std;
void xuat(int n);
void nhap(int A[], int &n, int &x);
int SHHmaxNhoHonX(int A[], int n, int x);
bool ktSHH(int n);
int main()
{
	int A[1000], n, x;
	nhap(A,n,x);
	int kq= SHHmaxNhoHonX(A,n,x);
	xuat(kq);
}

void nhap(int A[], int &n, int &x)
{
	cin>>n>>x;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int SHHmaxNhoHonX(int A[], int n, int x)
{
	int max=0;
	for(int i=0;i<n;i++)
		if(ktSHH(A[i])==1 && A[i]<x)
			max=A[i];
	for(int i=0;i<n;i++)
		if(ktSHH(A[i])==1 && A[i]>max && A[i]<x)
			max=A[i];
	return max;
}

bool ktSHH(int n)
{
	int s=0;
	for(int i=1; i<= n/2; i++)
	{
		if (n%i == 0)
			s+= i;
	}
	if (s==n)
		return 1;
	else
		return 0;
}

void xuat(int n)
{
	cout<<n;
}
