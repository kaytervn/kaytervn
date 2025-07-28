#include<iostream>
void nhap(int &n, int A[]);
int GTchanMin(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap (n,A);
	int kq=GTchanMin(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int GTchanMin(int n, int A[])
{
	int min=-1;
	for(int i=0;i<n;i++)
		if(A[i]%2==0)
			min=A[i];
	for(int i=0;i<n;i++)
		if(A[i]%2==0 && A[i]<min)
			min=A[i];
	return min;
}

void xuat(int kq)
{
	cout<<kq;
}
