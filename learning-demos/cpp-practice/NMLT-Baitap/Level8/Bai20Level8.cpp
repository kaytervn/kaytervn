#include<iostream>
void nhap(int A[], int &n);
int viTriLonHonXdau(int A[], int n, int x);
void sapXepTangDan(int A[], int &n, int x);
void xuat(int C[], int nC);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE];
	int n;
	nhap(A,n);
	xuat(A,n);
	return 0;
}

void nhap(int A[], int &n)
{
	cin>>n;
	int i=0;
	while(i<n)
	{
		cin>>A[i];
		sapXepTangDan(A,i,A[i]);
	}
}

int viTriLonHonXdau(int A[], int n, int x)
{
	for(int i=0;i<n;i++)
		if(A[i]>x)
			return i;
	return n;
}

void sapXepTangDan(int A[], int &n, int x)
{
	int k=viTriLonHonXdau(A,n,x);
	for(int i=n-1;i>=k;i--)
		A[i+1]=A[i];
	A[k]=x;
	n++;
}

void xuat(int C[], int nC)
{
	for(int i=0;i<nC;i++)
		cout<<C[i]<<" ";
}
