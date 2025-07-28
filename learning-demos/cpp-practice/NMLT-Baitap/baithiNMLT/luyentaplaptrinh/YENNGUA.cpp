#include<iostream>
#define SIZE 100
using namespace std;

bool ktYenNgua(int A[][SIZE], int m, int n, int x, int y)
{
	int tam=A[x][y];
	
	//max hang
	for(int j=0;j<n;j++)
		if(tam<A[x][j])
			return 0;
	
	//min cot
	for(int i=0;i<m;i++)
		if(tam>A[i][y])
			return 0;
	
	return 1;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

int main()
{
	int n, m, A[SIZE][SIZE], x[SIZE], y[SIZE];
	nhap(A,m,n);
	int dem=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
		{
			if(ktYenNgua(A,m,n,i,j))
			{
				x[dem]=i;
				y[dem]=j;
				dem++;
			}
		}
	cout<<dem<<endl;
	
	for(int i=0;i<dem;i++)
		cout<<x[i]+1<<" "<<y[i]+1<<endl;

	return 0;
}
