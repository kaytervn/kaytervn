#include<bits/stdc++.h>
using namespace std;

void nhapTach(int C[], int &n, int A[], int &a, int B[], int &b){
	cin>>n;
	for(int i=0;i<n;i++)
	{
		cin>>C[i];
		if(C[i]%2==0)
		{
			A[a]=C[i];
			a++;
		}
		else
		{
			B[b]=C[i];
			b++;
		}
	}
}

void xuat(int A[],int n)
{
	for(int i=0;i<n;i++)
	{
		cout<<A[i]<<" ";
	}
	cout<<endl;
}

void sort(int A[], int n)
{
	for(int i=0;i<n-1;i++)
	{
		for(int j=i+1;j<n;j++)
			if(A[i]>A[j])
				swap(A[i],A[j]);
	}
}

int main()
{
	int A[100],a,B[100],b;
	int C[100],n;
	a=0;
	b=0;
	nhapTach(C,n,A,a,B,b);
	sort(A,a);
	sort(B,b);

//	xuat(A,a);
//	xuat(B,b);
	
	int iA=0;
	int iB=0;
	int nC=0;
	while(iA<a && iB<b)
	{
		C[nC++]=A[iA++];
		C[nC++]=B[iB++];
	}
	
	while(iB<b)
	{
		C[nC++]=B[iB++];
	}
	
	while(iA<a)
	{
		C[nC++]=A[iA++];
	}
	xuat(C,n);
}
