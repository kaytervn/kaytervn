#include<iostream>
void nhap(int &n, int A[]);
void xuat(int n,int A[]);
using namespace std;
int main()
{
	int n, A[1000];
	nhap (n,A);
	xuat (n,A);
	return 0;
}
void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}
void xuat(int n,int A[])
{
	for(int i=0; i<n;i++)
		cout<<A[i]<<" ";
}
