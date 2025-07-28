#include<bits/stdc++.h>
using namespace std;

int dem =0;

int tinhGiaiThua(int n)
{
	if(n==0)
		return 1;
	return n*tinhGiaiThua(n-1);
}

void xuat(int S[], int n)
{
	for(int i=1;i<=n;i++)
		cout<<S[i]<<" ";
	cout<<endl;
}

void daoChuoi(int S[], int d, int c)
{
	while(d<c)
	{
		swap(S[d],S[c]);
		d++;
		c--;
	}
}

void sinhHoanVi(int S[], int n)
{
	xuat(S,n);
	dem++;
	int c=tinhGiaiThua(n);
	
	for(int i=1;i<=c-1;i++)
	{
		int m=n-1;
		while(S[m]>S[m+1])
			m--;
			
		int k=n;
		while(S[k]<S[m])
			k--;
			
		swap(S[m],S[k]);
		daoChuoi(S,m+1,n);
		
		xuat(S,n);
		dem++;
	}
}

int main()
{
	int n=3;
	int S[n];
	for(int i=1;i<=n;i++)
	{
		S[i]=i;
	}
	sinhHoanVi(S,n);
	cout<<dem;
	return 0;
}
