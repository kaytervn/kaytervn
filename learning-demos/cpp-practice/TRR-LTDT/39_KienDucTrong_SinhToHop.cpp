#include<bits/stdc++.h>
using namespace std;

int tinhToHop(int m, int n)
{
	if(m==0 || m==n)
		return 1;
	if(m==1)
		return n;
	return tinhToHop(m-1,n-1) + tinhToHop(m,n-1);
}

void xuat(int S[], int m)
{
	for(int i=1;i<=m;i++)
		cout<<S[i]<<" ";
	cout<<endl;
}

void sinhToHop(int S[], int m, int n)
{
	xuat(S,m);
	
	int c=tinhToHop(m,n);
	
	for(int i=1;i<=c-1;i++)
	{
		int j=m;
		while(S[j] == n-m+j)
			j--;
		
		S[j]=S[j]+1;
		
		for(int r=j+1;r<=m;r++)
		{
			S[r]=S[r-1]+1;
		}
		xuat(S,m);
	}
}

int main()
{
	int m=3;
	int n=5;
	int S[m];
	for(int i=1;i<=m;i++)
	{
		S[i]=i;
	}
	sinhToHop(S,m,n);
	return 0;
}
