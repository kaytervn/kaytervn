#include<iostream>
#define SIZE 100
using namespace std;

void lietKeTapCon(int k);
void xuat();

int A[SIZE]={0}, n,k;

int main()
{
	cin>>k>>n;
	lietKeTapCon(0);	
	
	return 0;
}

int dem1()
{
	int dem=0;
	for(int i=0;i<n;i++)
		if(A[i]==1)
			dem++;
	return dem;
}

void lietKeTapCon(int x)
{
	if(x==n)
	{
		if(dem1()==k)
			xuat();
//		cout<<dem1<<endl;
	}
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[x]=i;
			lietKeTapCon(x+1);
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
