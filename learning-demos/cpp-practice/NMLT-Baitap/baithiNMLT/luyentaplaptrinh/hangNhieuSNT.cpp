#include<bits/stdc++.h>
using namespace std;

bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
		if(n%i == 0)
			return 0;
	return 1;
}

int main()
{
	int A[100][100],m,n,dem,mark;
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];

	int B[1000];
	mark=0;
	for(int i=0;i<m;i++)
	{
		dem=0;
		for(int j=0;j<n;j++)
			if(ktSNT(A[i][j])==1)
			{
				mark=1;
				dem++;
			}
	}
	
	if(mark==0)
		cout<<-1;
	else
	{
		int max=B[0];
		for(int i=1;i<m;i++)
			if(B[i]>max)
				max=B[i];
		
		for(int i=0;i<m;i++)
			if(B[i]==max)
			{
				cout<<i;
				return 0;
			}
	}	
}
