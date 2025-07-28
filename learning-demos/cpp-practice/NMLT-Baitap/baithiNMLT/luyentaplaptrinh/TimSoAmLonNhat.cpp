#include<iostream>
void nhap(int &n, int A[]);
int vtAmMax(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n, A[1000];
	nhap (n,A);
	int kq=vtAmMax(n,A);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int vtAmMax(int n, int A[])
{
	int max=0; 
	for(int i=0; i<n; i++)
		if(A[i]<0)
		{
			max=A[i];
		}
	for(int i=0; i<n; i++)
		if(A[i]<0 && A[i]>max)
		{
			max=A[i];
		}
	return max;
}

void xuat(int kq)
{
	cout<<kq;
}
