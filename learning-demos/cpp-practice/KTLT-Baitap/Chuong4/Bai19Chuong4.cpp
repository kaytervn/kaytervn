#include<iostream>
#define SIZE 100
using namespace std;
bool thoaMan(int x, int k);
void xuat();
void queen(int k);

int A[SIZE][SIZE]={0};
int n;

int main()
{
	cin>>n;
	queen(0);
	
	return 0;
}

bool thoaMan(int x, int k)
{
	for(int i=1;i<=k;i++)
	{
		if((x-i>=0 && k-i >=0 && A[x-i][k-i]==1)
		|| (x+i<= n && k-i >=0 && A[x+i][k-i]==1)
		||  (k-i>=0 && A[x][k-i])==1)
			return 0;
	}
	
	for(int i=1;i<=n-k;i++)
	{
		if((x-i >=0 && k+i <= n && A[x-i][k+i]==1)
		|| (x+i <= n && k+i <= n && A[x+i][k+i]==1)
		|| (k+i<=n && A[x][k+i]==1))
			return 0;
	}
	
	for(int i=1;i<=x;i++)
	{
		if(A[x-i][k]==1)
			return 0;
	}
	
	for(int i=1;i<=n-x;i++)
	{
		if(A[x+i][k]==1)
			return 0;
	}
	
	return 1;
}

void xuat()
{
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++)
			cout<<A[i][j]<<" ";
		cout<<endl;
	}
	cout<<endl;
}

void queen(int k)
{
	if(k==n)
	{
		xuat();
	}
	else
	{
		for(int i=0;i<n;i++)
		{
			if(thoaMan(i,k))
			{
				A[i][k]=1;
				queen(k+1);
				A[i][k]=0;
			}
		}
	}
}
