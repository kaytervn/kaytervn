#include<bits/stdc++.h>
using namespace std;

int tongChuSoN(int n)
{
	int s=0;
	while(n>0)
	{
		s+=n%10;
		n/=10;
	}
	return s;
}

int main()
{
	int n, A[1000];
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
		
	int tmp=tongChuSoN(A[n-1]);
	int dem=0;
	for(int i=0;i<n-1;i++)
	{
		if(tmp>tongChuSoN(A[i]))
			dem++;
		else
			dem--;
	}
	cout<<dem;
}
