#include<iostream>
#define SIZE 100
using namespace std;

void xuat(int x);
void nhap(int A[], int &n, int &x);
int timXnhiPhan(int A[], int left, int right, int x);

int main()
{
	int A[SIZE],n,x,left,right;
	nhap(A,n,x);
	left=0;
	right=n-1;
	int kq= timXnhiPhan(A,left,right,x);
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

int timXnhiPhan(int A[], int left, int right, int x)
{
	if(right>=left)
	{
		int mid=left+(right-left)/2;
		if(A[mid]==x)
			return mid;
		else
			if(A[mid]>x)
				return timXnhiPhan(A,left,mid-1,x);
			else
				return timXnhiPhan(A,mid+1,right,x);
	}
	return -1;
}
