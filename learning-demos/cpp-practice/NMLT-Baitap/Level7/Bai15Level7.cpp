#include<iostream>
void nhap(int &n,int A[]);
bool checkCapSoCong(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=checkCapSoCong(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool checkCapSoCong(int n, int A[])
{
	int d=A[1]-A[0];
	if(A[2]-A[1]!=d)
		return 0;
	return 1;
}

void xuat(int n)
{
	cout<<n;
}
