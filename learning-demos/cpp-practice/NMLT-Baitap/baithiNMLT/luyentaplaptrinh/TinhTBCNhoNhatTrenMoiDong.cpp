#include<iostream>
using namespace std;

void nhap(int A[100][100], int &m, int &n);
void xuat(double n);
double tbcMinMoiDong(int A[100][100], int m, int n);
double tinhTBCmang(int A[], int n);
int lamTron(double a);
int timMinDong(int A[100][100], int m, int n, int dong);


int main()
{
	int n, m, A[100][100];
	nhap(A,m,n);	
	double kq=tbcMinMoiDong(A,m,n);
	xuat(kq);
	return 0;
}

void nhap(int A[100][100], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];	
}

void xuat(double n)
{
	cout<<n;
}

double tbcMinMoiDong(int A[100][100], int m, int n)
{
	int B[100];
	for(int i=0;i<m;i++)
		B[i]=timMinDong(A,m,n,i);
	double tbc=tinhTBCmang(B,m);
	return lamTron(tbc);
}

int timMinDong(int A[100][100], int m, int n, int dong)
{
	int min=A[dong][0];
	for(int j=0;j<n;j++)
		if(A[dong][j]<min)
			min=A[dong][j];
	return min;
}

double tinhTBCmang(int A[], int n)
{
	int s=0;
	for(int i=0;i<n;i++)
		s += A[i];
	double kq;
	if(n>0)
		kq=(double)s/n;
	return kq;
}

int lamTron(double a)
{
	int h;
		if ((a-int(a))>=0.5)
			h=int(a)+1;
		else h=int(a);
	return h;
}
