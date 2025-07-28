#include<bits/stdc++.h>
using namespace std;

int main()
{
	int m,n, A[100][100], B[10000];
	cin>>m>>n;
	
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
	
	int s;
	for(int i=0;i<m;i++)
	{
		s=0;
		for(int j=0;j<n;j++)
			s+=A[i][j];
		B[i]=s;
	}
	
	int min=INT_MAX;
	for(int i=0;i<m;i++)
		if(B[i]<min)
			min=B[i];
	
	cout<<min;

}
