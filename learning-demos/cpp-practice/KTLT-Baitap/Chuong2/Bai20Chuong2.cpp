#include<iostream>
#include<iomanip>
#define SIZE 100
using namespace std;

void taoMangXoanOc(int A[][SIZE], int n);
void nhap(int &n);
void xuat(int A[][SIZE], int n);

int main()
{
	int A[SIZE][SIZE],n;
	nhap(n);
	taoMangXoanOc(A,n);
	xuat(A,n);
	return 0;
}

void taoMangXoanOc(int A[][SIZE], int n)
{
	int d,hang,cot,dem;
	d=0;
	hang=n-1;
	cot=n-1;
	dem=1;
	
	while(d<=n/2)
	{
		for(int i=d;i<=cot;i++)
			A[d][i]=dem++;
		for(int i=d+1;i<=hang;i++)
			A[i][cot]=dem++;
		for(int i=cot-1;i>=d;i--)
			A[hang][i]=dem++;
		for(int i=hang-1;i>=d+1;i--)
			A[i][d]=dem++;
		d++;
		hang--;
		cot--;
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
			cout<<setw(3)<<A[i][j]<<" ";
		cout<<endl<<endl;
	}		
}
