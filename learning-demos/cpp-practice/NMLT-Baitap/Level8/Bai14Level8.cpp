#include<iostream>
#include<cmath>
void nhap(int &n, double A[]);
double doanAB(int n, double A[],int &a, int &b);
double max(int n, double A[]);
double min(int n, double A[]);
void xuat(int a, int b);
using namespace std;

int main()
{
	int n,a,b;
	double A[1000];
	nhap (n,A);
	doanAB(n,A,a,b);
	xuat (a,b);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double doanAB(int n, double A[],int &a, int &b)
{
	a=(int)min(n,A);
	b=(int)max(n,A);
	if(a<0)
		if(a != min(n,A))
			a--;
	if(b>0)
		if(b != max(n,A))
			b++;
}

double max(int n, double A[])
{
	double max=A[0];
	for(int i=1; i<n; i++)
		if(A[i]>max)
			max=A[i];
	return max;
}

double min(int n, double A[])
{
	double min=A[0];
	for(int i=1; i<n; i++)
		if(A[i]<min)
			min=A[i];
	return min;
}

void xuat(int a, int b)
{
	cout<<"["<<a<<";"<<b<<"]";
}
