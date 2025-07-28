#include<iostream>
using namespace std;
void nhap(int &n,int &x,int &y, int A[]);
void xuat(int n,int x,int y,int A[]);

int main()
{
	int n,x,y, A[1000];
	nhap(n,x,y, A);
	xuat(n,x,y, A);
	return 0;
}

void nhap(int &n,int &x,int &y, int A[])
{
	cin>>n>>x>>y;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

void xuat(int n,int x,int y,int A[])
{
	for(int i=0;i<n;i++)
	{
		if(A[i]>=x && A[i]<=y)
			cout<<A[i]<<" ";
	}
}
