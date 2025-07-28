#include<bits/stdc++.h>
using namespace std;


void xuat(int A[],int n)
{
	for(int i=0;i<n;i++)
	{
		cout<<A[i]<<" ";
	}
	cout<<endl;
}


void QS(int A[], int n, int l, int r){
	int i=l;
	int j=r;
	int x=A[l];
	while(i<j)
	{
		while(A[i]<x)
			i++;
		while(A[j]>x)
			j--;
		if(i<=j){
			swap(A[i],A[j]);
			xuat(A,n);
			i++;
			j--;
		}
	}
	if(l<j)
		QS(A,n,l,j);
	if(i<r)
		QS(A,n,i,r);
}

int main()
{
	int A[100],n;
	cin>>n;
	for(int i=0;i<n;i++)
	{
		cin>>A[i];
	}
	
	int l=0;
	int r=n-1;
	
	QS(A,n,l,r);
	xuat(A,n);
	
}


