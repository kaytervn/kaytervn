#include<iostream>
#include<iomanip>
#define SIZE 100
using namespace std;

void maTranKyAo(int A[][SIZE], int n);
void nhap(int &n);
void xuat(int A[][SIZE], int n);

int main()
{
	int A[SIZE][SIZE],n;
	nhap(n);
	maTranKyAo(A,n);
	xuat(A,n);
	
	return 0;
}

void maTranKyAo(int A[][SIZE], int n)
{
	int  hang,cot,dem;
	hang=(n-1)/2;
	cot=hang+1;
	dem=1;
	
	while(dem<=n*n)
	{		
		if(dem>1 && (dem-1)%n==0)
		{
			cot++;
			hang++;
		}
		if(cot>n-1)
			cot-=n;
		if(hang<0)
			hang=n-1;

		A[hang][cot]=dem;
		
		dem++;
		hang--;
		cot++;
	}
}

void nhap(int &n)
{
	cin>>n;
}

void xuat(int A[][SIZE], int n)
{
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++)
		{
			cout<<setw(3)<<A[i][j]<<" ";
		}
		cout<<endl<<endl;
	}
}
