#include<iostream>
#define SIZE 100
using namespace std;

void xuat(int x);
void nhap(int A[], int &n, int &x);
int timXnhiPhan(int A[], int n, int x);

int main()
{
	int A[SIZE],n,x;
	
	nhap(A,n,x);
	int kq= timXnhiPhan(A,n,x);
	xuat(kq);
	
	return 0;
}

void xuat(int x)
{
	cout<<x;
}

void nhap(int A[], int &n, int &x)
{
	cin>>n>>x;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int timXnhiPhan(int A[], int n, int x)
{
	int r,l;
	r=n-1;
	l=0;
	
	for(int i=l;i<r;i++)
	{
		int mid= (l+r-1)/2;
		if(A[mid]==x)
			return mid;
		else
			if(A[mid]>x)
				r=mid-1;
			else
				l=mid+1;	
	}
	return -1;
}
