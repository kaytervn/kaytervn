#include<iostream>
#define SIZE 100
using namespace std;

void lietKeTapCon(int k);
void xuat();

int A[SIZE]={0}, n;

int main()
{
	cin>>n;
	lietKeTapCon(0);	
	
	return 0;
}

void lietKeTapCon(int k)
{
	if(k==n)
		xuat();
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[k]=i;
			lietKeTapCon(k+1);
		}
	}	
}

void xuat()
{
	cout<<"{ ";
	for(int i=0;i<n;i++)
		if(A[i]==1)
			cout<<i<<" ";
	cout<<" }\n";
}
