#include<iostream>
#define SIZE 100
using namespace std;

int UCLN(int a, int b);
int UCLNmang(int A[], int n);
void nhap(int A[], int &n);
void xuat(int a);

int main()
{
	int A[SIZE],n;
	nhap(A,n);
	int kq=UCLNmang(A,n);
	xuat(kq);
	return 0;
}

int UCLN(int a, int b)
{
	if(a==0)
		return b;
	if(b%a==0)
		return a;
	return UCLN(b%a,a);
}

int UCLNmang(int A[], int n)
{
	int x=A[0];
	for(int i=1;i<n;i++)
		x=UCLN(x,A[i]);
	return x;
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
