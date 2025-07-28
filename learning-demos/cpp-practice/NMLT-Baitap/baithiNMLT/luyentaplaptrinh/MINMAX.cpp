#include<iostream>
void nhap(int &n,int A[]);
void mangDangSong(int n, int A[], int &max, int &min);
int timMax(int A[], int n);
int timMin(int A[], int n);
void xuat(int a, int b);
using namespace std;

int main()
{
	int n,A[1000],max,min;
	nhap(n,A);
	mangDangSong(n,A,max,min);
	xuat(max,min);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

void mangDangSong(int n, int A[], int &max, int &min)
{
	max=timMax(A,n);
	min=timMin(A,n);
}

int timMax(int A[], int n)
{
	int max=A[0];
	for(int i=0;i<n;i++)
		if(A[i]>max)
			max=A[i];
	return max;
}

int timMin(int A[], int n)
{
	int max=A[0];
	for(int i=0;i<n;i++)
		if(A[i]<max)
			max=A[i];
	return max;
}

void xuat(int a, int b)
{
	cout<<a<<" "<<b;
}
