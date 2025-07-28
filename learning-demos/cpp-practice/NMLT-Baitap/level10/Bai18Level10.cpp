#include<iostream>
#define SIZE 100
using namespace std;

int demYenNgua(int A[][SIZE], int m, int n);
bool ktYenNgua(int A[][SIZE], int m, int n, int x, int y);
void nhap(int A[][SIZE], int &m, int &n);
void xuat(int a);

int main()
{
	int n, m, A[SIZE][SIZE];
	nhap(A,m,n);
	int kq=demYenNgua(A,m,n);
	xuat(kq);
	return 0;
}

int demYenNgua(int A[][SIZE], int m, int n)
{
	int dem=0;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
		{
			if(ktYenNgua(A,m,n,i,j))
				dem++;
		}
	return dem;
}

bool ktYenNgua(int A[][SIZE], int m, int n, int x, int y)
{
	int tam=A[x][y];
	
	//max hang
	for(int j=0;j<n;j++)
		if(tam<A[x][j])
			return 0;
	
	//min cot
	for(int i=0;i<m;i++)
		if(tam>A[i][y])
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
