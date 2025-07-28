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
	lietKeHoanVi(0);
	return 0;
}

void lietKeHoanVi(int k)
{
	if(k==n)
		xuat();
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
		cout<<A[i]<<" ";
	}
	cout<<endl;
	dem++;
}
