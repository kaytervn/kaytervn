#include<iostream>
#include<cmath>
void nhap(int &n, int A[]);
int soLonNhi(int n, int A[]);
void hoanDoi(int &a, int &b);
int UCLN(int a, int b);
void xuat(int n);
using namespace std;
#define SIZE 10000

int main()
{
	int A[SIZE];
	int n;
	nhap(n,A);
	int kq=soLonNhi(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int soLonNhi(int n, int A[])
{
	for(int i=0;i<n;i++)
		for(int j=i+1;j<n;j++)
			if(A[j]<A[i])
				hoanDoi(A[j],A[i]);
	return UCLN(A[0], A[1]);
}

void hoanDoi(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

int UCLN(int a, int b)
{
	a=abs(a);
	b=abs(b);
	while(a!=b)
	{
		if (a>b)
			a-= b;
		else
			b-= a;
	}
	return a;
}


void xuat(int n)
{
	cout<<n;
}
