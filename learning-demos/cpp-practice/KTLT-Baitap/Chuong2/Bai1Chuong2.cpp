#include<iostream>
#define SIZE 100
using namespace std;

void xuat(int x);
void nhap(int A[], int &n, int &x);
int timX(int A[], int n, int x);

int main()
{
	int A[SIZE],n,x;
	
	nhap(A,n,x);
	int kq= timX(A,n,x);
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

int timX(int A[], int n, int x)
{
	A[n]=x;
	int i=0;
	while(A[i]!=x)
		i++;
	if(i<n)
		return 1;
	else
		return -1;
}
