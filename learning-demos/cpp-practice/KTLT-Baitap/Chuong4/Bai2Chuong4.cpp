#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[], int &n);
void xuat(int a);
int tong(int A[], int n);

int main()
{
	int A[SIZE], n;
	nhap(A,n);
	int kq=tong(A,n);
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

int tong(int A[], int n)
{
	if(n==0)
		return 0;
	else
		return A[n-1]+tong(A,n-1);
}
