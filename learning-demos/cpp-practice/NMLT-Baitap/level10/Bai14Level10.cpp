#include<iostream>
#define SIZE 100
using namespace std;

void viTriMax(int A[][SIZE], int m, int n, int max, int &d, int &c);
int timMax(int A[][SIZE], int m, int n);
void nhap(int A[][SIZE], int &m, int &n);
void xuat(int a, int b);


int main()
{
	int n, m, A[SIZE][SIZE], d, c;
	nhap(A,m,n);
	int max=timMax(A,n,m);
	viTriMax(A,m,n,max,d,c);
	xuat(d,c);
	return 0;
}

void viTriMax(int A[][SIZE], int m, int n, int max, int &d, int &c)
{
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
				if(A[i][j]==max)
				{
					d=i;
					c=j;
				}
}

int timMax(int A[][SIZE], int m, int n)
{
	int max=A[0][0];
	for(int i=1;i<m;i++)
		for(int j=1;j<n;j++)
			if(A[i][j]>max)
				max=A[i][j];
	return max;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

void xuat(int a, int b)
{
	cout<<a<<" "<<b<<endl;
}
