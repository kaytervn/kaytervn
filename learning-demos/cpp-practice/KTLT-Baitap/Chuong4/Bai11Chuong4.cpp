#include<iostream>
#define SIZE 100
using namespace std;

void lietKeNhiPhan(int k);
void xuat();

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
		xuat();
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[k]=i;
			lietKeNhiPhan(k+1);
		}
	}
}

void xuat()
{
	for(int i=0;i<n;i++)
		cout<<A[i];
	cout<<endl;
}
