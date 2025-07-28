#include<iostream>
#define SIZE 100
using namespace std;

void lietKeHoanVi(int k);
void xuat();

int A[SIZE],B[SIZE]={0},n;
int dem=0;

int main()
{
	cin>>n;
	n=n+1;
	lietKeHoanVi(0);
	return 0;
}

bool checkTang()
{
	for(int i=0;i<n-1;i++)
		if(A[i]>A[i+1])
			return 0;
	return 1;
}

bool checkGiam()
{
	for(int i=0;i<n-1;i++)
		if(A[i]<A[i+1])
			return 0;
	return 1;
}

void lietKeHoanVi(int k)
{
	if(k==n)
	{
//		if((checkTang()==1) || (checkGiam()==1))
		xuat();
	}
	else
	{
		for(int i=0;i<n;i++)
		{
			if(B[i]==0)
			{
				A[k]=i;
				B[i]=1;
				lietKeHoanVi(k+1);
				B[i]=0;
			}
		}
	}
}

void xuat()
{
	for(int i=0;i<n;i++)
	{
		if(A[i]==0)
			continue;
		cout<<A[i]<<" ";
	}
	cout<<endl;
	dem++;
}
