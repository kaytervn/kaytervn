#include<iostream>
void nhap(int &n, int A[]);
void xepMang(int nA, int A[]);
void hoanDoi(int &a, int &b);
void xuat(int n, int A[]);
using namespace std;
#define SIZE 1000

int main()
{
	int A[SIZE];
	int nA;
	nhap(nA,A);
	xepMang(nA,A);
	xuat(nA,A);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void xepMang(int nA, int A[])
{
	int i=0;
	while(i<nA)
	{
		int j=i+1;
		while(j<nA)
		{
			if(A[i]%2!=0 && A[j]%2==0)
				hoanDoi(A[i],A[j]);
			else
				if(A[i]==0 && A[j]%2==0)
					hoanDoi(A[i],A[j]);
			j++;
		}
		i++;
	}
}

void hoanDoi(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

void xuat(int n, int A[])
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
}
