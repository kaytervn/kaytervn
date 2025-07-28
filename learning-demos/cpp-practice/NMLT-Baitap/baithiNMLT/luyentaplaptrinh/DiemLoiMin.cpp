#include<bits/stdc++.h>
using namespace std;

bool laDiemLoi(int A[][100], int i, int j)
{
	if(A[i][j]<=A[i][j+1]
	|| A[i][j]<=A[i][j-1]
	|| A[i][j]<=A[i+1][j]
	|| A[i][j]<=A[i-1][j])
		return 0;

	return 1;
}

int main()
{
	int m,n,A[100][100],B[1000],D[1000],C[1000];
	int nB=0;
	cin>>m>>n;
	
	for(int j=0;j<n+2;j++)
	{
		A[0][j]=INT_MIN;
		A[m+1][j]=INT_MIN;
	}
			
	for(int i=1;i<m+1;i++)
	{
		A[i][0]=INT_MIN;
		A[i][n+1]=INT_MIN;
	}
	
	for(int i=1;i<=m;i++)
		for(int j=1;j<=n;j++)
			cin>>A[i][j];
	
	for(int i=1;i<=m;i++)
		for(int j=1;j<=n;j++)
		{
			if(laDiemLoi(A,i,j)==1)
			{
				B[nB]=A[i][j];
				D[nB]=i;
				C[nB]=j;
				nB++;
			}
		}
	int p=-1;
	int min=INT_MAX;

	for(int i=0;i<nB;i++)
		if(B[i]<min)
		{
			min=B[i];
			p=i;
		}
	
	if(p==-1)
		cout<<p;
	else
		cout<<D[p]-1<<" "<<C[p]-1;
	
}
