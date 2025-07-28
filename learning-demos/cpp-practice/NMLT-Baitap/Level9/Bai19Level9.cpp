#include<iostream>
void nhap(int &n, int A[]);
int soLonNhi(int n, int A[]);
void hoanDoi(int &a, int &b);
void xuat(int n);
using namespace std;
#define SIZE 1000

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
	int max1=A[0];
	int max2=A[1];

	for(int i=0;i<n;i++)
	{
		if(max1==max2)
			max2=A[i+1];
		else
			if(max1<max2)
				hoanDoi(max1,max2);
		if(A[i]>max1)
		{
			max2=max1;
			max1=A[i];
		}
	}
	return max2;
}

void hoanDoi(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

void xuat(int n)
{
	cout<<n;
}
