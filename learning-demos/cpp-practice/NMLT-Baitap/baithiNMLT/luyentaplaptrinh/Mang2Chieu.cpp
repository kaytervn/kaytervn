#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[][SIZE], int &m, int &n);
void chuyenVi(int A[][SIZE], int m, int n,int B[][SIZE]);
int tongDuongCheoChinh(int A[][SIZE], int m, int n);
void xuatMaTran(int A[][SIZE], int m, int n);
void xuatSo(int n);
int minDuongCheoPhu(int A[][SIZE], int m, int n);
int tongDuongBien(int A[][SIZE], int m, int n);


int main()
{
	int n, m, A[SIZE][SIZE], B[SIZE][SIZE];
	nhap(A,m,n);	
	xuatMaTran(A,m,n);
	chuyenVi(A,m,n,B);
	xuatMaTran(B,n,m);
	int tong=tongDuongCheoChinh(B,n,m);
	xuatSo(tong);
	int min=minDuongCheoPhu(B,n,m);
	xuatSo(min);
	int tongDB=tongDuongBien(B,n,m);
	xuatSo(tongDB);
	return 0;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m;
	n=m;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];	
}

void chuyenVi(int A[][SIZE], int m, int n,int B[][SIZE])
{
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			B[j][i]=A[i][j];
}

int tongDuongCheoChinh(int A[][SIZE], int m, int n)
{
	int s=0;
	for(int i=0;i<m;i++)
		s += A[i][i];
	return s;
}

int minDuongCheoPhu(int A[][SIZE], int m, int n)
{
	int min=A[0][n-1];
	for(int i=1;i<m;i++)
		if(A[i][n-i-1]<min)
			min=A[i][n-i-1];
	return min;
}

int tongDuongBien(int A[][SIZE], int m, int n)
{
	int s=0;
	for(int i=0;i<m;i++)
		if(i==0 || i==m-1)
			for(int j=0;j<n;j++)
				s += A[i][j];
		else
			s += A[i][0]+ A[i][n-1];
	return s;
}

void xuatMaTran(int A[][SIZE], int m, int n)
{
	for(int i=0;i<m;i++)
	{
		for(int j=0;j<n;j++)
			cout<<A[i][j]<<" ";
		cout<<endl;
	}
}

void xuatSo(int n)
{
	cout<<n<<endl;
}
