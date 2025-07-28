#include<iostream>
#define SIZE 100
using namespace std;

int demHoangHau(int A[][SIZE], int m, int n);
bool ktHoangHau(int A[][SIZE], int m, int n, int x, int y);
void nhap(int A[][SIZE], int &m, int &n);
void xuat(int a);

int main()
{
	int n, m, A[SIZE][SIZE];
	nhap(A,m,n);
	int kq=demHoangHau(A,m,n);
	xuat(kq);
	return 0;
}

int demHoangHau(int A[][SIZE], int m, int n)
{
	int dem=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
		{
			if(ktHoangHau(A,m,n,i,j))
				dem++;
		}
	return dem;
}

bool ktHoangHau(int A[][SIZE], int m, int n, int x, int y)
{
	int tam =A[x][y];
	
	//max hang
	for(int j=0;j<n;j++)
		if(tam<A[x][j])
			return 0;
	
	//max cot
	for(int i=0;i<m;i++)
		if(tam<A[i][y])
			return 0;
			
	//duong cheo 1 (trai -> phai)
	//trai tang tren
	for(int i=x-1; i>=0; i--)
		for(int j=y-1; j>=0; j--)
			if(tam<A[i][j])
				return 0;
	
	//phai giam duoi
	for(int i=x+1; i<m; i++)
		for(int j=y+1; j<n; j++)
			if(tam<A[i][j])
				return 0;
	
	//duong cheo 2 (phai -> trai)
	//phai tang tren
	for(int i=x+1; i<m; i++)
		for(int j=y-1; j>=0; j--)
			if(tam<A[i][j])
				return 0;
	
	//trai giam duoi
	for(int i=x-1; i>=0; i--)
		for(int j=y+1; j<n; j++)
			if(tam<A[i][j])
				return 0;
				
	return 1;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

void xuat(int a)
{
	cout<<a;
}
