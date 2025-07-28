#include<iostream>
#define SIZE 10000
using namespace std;

void nhap(int A[], int &n);
void ganMang(int A[], int n, int L[]);
void quyHoachDong(int A[], int n, int L[]);
void xuat(int A[], int n);
int dem=0;
int main()
{
	int A[SIZE],L[SIZE],n,X[SIZE];
	int k=0;
	nhap(A,n);
	quyHoachDong(A,n,L);
	ganMang(A,n,L);
	cout<<dem;
	return 0;
}

void nhap(int A[], int &n)
{
	cin>>n;
	for(int i=1;i<=n;i++)
		cin>>A[i];
}

int timMax(int A[], int a, int b)
{
	int max=A[a];
	for(int i=a;i<b;i++)
		if(A[i]>=max)
			max=A[i];
	return max;
}

void ganMang(int A[], int n, int L[])
{
	for(int i=0;i<=n+1;i++)
	{
		int max=timMax(L,i+1,n+1);
		for(int j=i+1;j<=n+1;j++)
		{
			if(L[j]==max && A[j]>=A[i])
			{
				dem++;
				break;
			}
		}
	}
}

void xuat(int A[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
	cout<<endl;
}

void quyHoachDong(int A[], int n, int L[])
{
	for(int i=n+1;i>=0;i--)
	{
		L[i]=1;
		for(int j=i+1;j<=n+1;j++)
		{
			if((i==0 || j==n+1 || A[i]<=A[j]) && L[i]<L[j]+1)
				L[i]=L[j]+1;
		}
	}
}
