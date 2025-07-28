#include<iostream>
#define SIZE 100
using namespace std;

void nhap(double A[][SIZE], int &m, int &n);
int demSoChanDB(double A[][SIZE], int m, int n);
void xuat(int a);
bool evenCheck(double a);


int main()
{
	int n, m;
	double A[SIZE][SIZE];
	nhap(A,m,n);
	int kq=demSoChanDB(A,m,n);
	xuat(kq);
	return 0;
}

bool evenCheck(double a)
{
	if(a==(int)a)
		if((int)a%2==0)
			return 1;
	return 0;
}

int demSoChanDB(double A[][SIZE], int m, int n)
{
	int dem=0;
	for(int j=0;j<n;j++)
	{
		if(evenCheck(A[0][j]))
			dem++;
		if(evenCheck(A[m-1][j]))
			dem++;
	}

	for(int i=0;i<m;i++)
	{
		if(evenCheck(A[i][0]))
			dem++;
		if(evenCheck(A[i][n-1]))
			dem++;
	}

	return dem;
}

void nhap(double A[][SIZE], int &m, int &n)
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
