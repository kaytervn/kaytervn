#include<iostream>
#define SIZE 100
using namespace std;

void lietKeNhiPhan(int k);
void xuat();
int xoaSo0();

int A[SIZE],n;

int main()
{
	cin>>n;
	lietKeNhiPhan(0);	
	
	return 0;
}

void lietKeNhiPhan(int k)
{
	if(k==n)
	{
		if(A[n-1]!=0)
			xuat();
	}
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[k]=i;
			lietKeNhiPhan(k+1);
		}
	}
}

int xoaSo0()
{
	for(int i=0;i<n;i++)
		if(A[i]==1)
			return i;
}

void xuat()
{
	int vt=xoaSo0();
	for(int i=vt;i<n;i++)
		cout<<A[i]<<" ";
	cout<<endl;
}
