#include<iostream>
#define SIZE 100
using namespace std;

void lietKeHoanVi(int k);
void xuat();
void nhap();
void tinhChiPhi();

int A[SIZE],B[SIZE]={0},n;
int chiPhiToiUu=INT_MAX;
int C[SIZE][SIZE];
int H[SIZE];
int dem=0;

int main()
{
	nhap();
	lietKeHoanVi(0);
//	xuat();
	cout<<chiPhiToiUu;
	return 0;
}

void nhap()
{
	cin>>n;
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++)
			cin>>C[i][j];
	}
}

bool chiPhiGiua(int k)
{
	int chiPhi=0;
	for(int i=0;i<k-1;i++)
	{
		chiPhi+=C[A[i]][A[i+1]];
	}
	chiPhi+=C[A[k-1]][A[0]];
	if(chiPhi>chiPhiToiUu)
		return 1;
	else
		return 0;
}

void tinhChiPhi()
{
	int chiPhi=0;
	for(int i=0;i<n-1;i++)
		chiPhi+=C[A[i]][A[i+1]];
	chiPhi+=C[A[n-1]][A[0]];
	if(chiPhi<chiPhiToiUu)
	{
		chiPhiToiUu=chiPhi;
		for(int i=0;i<n;i++)
			H[i]=A[i];
	}
}

void lietKeHoanVi(int k)
{
//	if(chiPhiGiua(k)==1)	
//		return;
	if(k==n)
		tinhChiPhi();
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
	cout<<endl;
	for(int i=0;i<n;i++)
	{
		cout<<H[i]<<" ";
	}
	cout<<endl;
}
