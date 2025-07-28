#include<iostream>
#include<cmath>
#define SIZE 100
using namespace std;

bool SNTdau(int A[][SIZE], int m, int n, int &d, int &c);
bool ktSNT(int n);
void nhap(int A[][SIZE], int &m, int &n);
void xuat(int a, int b, int kq);

int main()
{
	int n, m, A[SIZE][SIZE], d,c;
	nhap(A,m,n);
	bool kq=SNTdau(A,m,n,d,c);
	xuat(d,c,kq);
	return 0;
}

bool SNTdau(int A[][SIZE], int m, int n, int &d, int &c)
{
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			if(ktSNT(A[i][j]))
			{
				d=i;
				c=j;
				return 1;
			}
	return 0;
}

bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
	{
		if(n%i == 0)
			return 0;
	}
	return 1;
}

void nhap(int A[][SIZE], int &m, int &n)
{
	cin>>m>>n;
	for(int i=0;i<m;i++)
		for(int j=0;j<n;j++)
			cin>>A[i][j];
}

void xuat(int a, int b, int kq)
{
	if(kq==1)
		cout<<a<<" "<<b;
	else
		cout<<"KHONG CO SNT";
}
