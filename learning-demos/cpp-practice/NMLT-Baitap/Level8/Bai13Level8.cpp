#include<iostream>
#include<cmath>
void nhap(int &n, int A[]);
int UclnMang(int n, int A[]);
int Ucln(int a, int b);
void xuat(int kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	int kq=UclnMang(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int UclnMang(int n, int A[])
{
	int x=A[0];
	for(int i=1;i<n;i++)
		x=Ucln(x,A[i]);
	return x;
}

int Ucln(int a, int b)
{
	int ucln;
	a=abs(a);
	b=abs(b);
	int x=min(a,b);
	for(int i=1; i<= x; i++)
		if(a%i==0 && b%i==0)
			ucln=i;
	return ucln;
}

void xuat(int kq)
{
	cout<<kq;
}
