#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[], int &n);
void xuat(int a);
int min(int A[], int n);

int main()
{
	int A[SIZE], n;
	nhap(A,n);
	int kq=min(A,n);
	xuat(kq);
	
	return 0;
}

void nhap(int A[], int &n)
{
	cin>>n;
	
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void xuat(int a)
{
	cout<<a;
}

int min(int A[], int n)
{
	if(n==0)
		return -1;
	if(n==1)
		return A[0];
	else
		if(A[n-1]<min(A,n-1))
			return A[n-1];
		else
			return min(A,n-1);
}
