#include<bits/stdc++.h>
using namespace std;

bool tangNN(int A[][100], int m, int n, int i)
{
	for(int j=1;j<n;j++)
		if(A[i][j-1]>=A[i][j])
			return 0;
	return 1;
}

int main()
{
	int m,n,A[100][100];
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
	
	int dem=0;
	for(int i=0;i<m;i++)
	{
		if(tangNN(A,m,n,i)==1)
			dem++;
	}
	cout<<dem;
		
		
	return 0;
}
