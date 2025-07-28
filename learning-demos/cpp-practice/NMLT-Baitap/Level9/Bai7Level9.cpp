#include<iostream>
void nhap(int &n, double A[]);
int demMax(int nA, double A[]);
int timMax(int n, double A[]);
void xuat(int n);
using namespace std;
#define SIZE 1000

int main()
{
	double A[SIZE];
	int nA;
	nhap(nA,A);
	int kq=demMax(nA,A);
	xuat(kq);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}

int demMax(int nA, double A[])
{
	int dem=0;
	for(int i=0;i<nA;i++)
		if(A[i]==timMax(nA,A))
			dem++;
	return dem;
}

int timMax(int n, double A[])
{
	double max=A[0];
	for(int i=1; i<n; i++)
		if(A[i]>max)
			max=A[i];
	return max;
}

void xuat(int n)
{
	cout<<n;
}
