#include<iostream>
#include<cmath>
#define SIZE 100
using namespace std;

int timSNTmin(int A[], int n);
bool ktSNT(int n);
void nhap(int A[], int &n);
void xuat(int a);

int main()
{
	int A[SIZE],n;
	nhap(A,n);
	int kq=timSNTmin(A,n);
	xuat(kq);
	return 0;
}

int timSNTmin(int A[], int n)
{
	int min=-1;
	for(int i=0;i<n;i++)
		if(ktSNT(A[i])==1)
		{
			min=A[i];
			break;
		}
	
	for(int i=0;i<n;i++)
		if(ktSNT(A[i])==1 && A[i]<min)
			min=A[i];
	return min;
}

bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
		if(n%i == 0)
			return 0;
	return 1;
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
