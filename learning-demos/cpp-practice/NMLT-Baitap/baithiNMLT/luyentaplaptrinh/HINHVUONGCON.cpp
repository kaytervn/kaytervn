#include<iostream>
#define SIZE 100

void nhap(int A[][SIZE], int &n, int &k);
void xuat(int kq);
int phanThuong(int A[][SIZE], int n, int k);

using namespace std;

int main ()
{
	int n,k,A[SIZE][SIZE];
	nhap(A,n,k);
	int kq=phanThuong(A,n,k);
	xuat(kq);
	return 0;
}

int phanThuong(int A[][SIZE], int n, int k)
{
	int x=0;
	int max=0;
	while(x+k<=n)
	{
		int y=0;
		while(y+k<=n)
		{
			int s=0;
			for(int i=x;i<x+k;i++)
				for(int j=y;j<y+k;j++)
					s+=A[i][j];
			y++;
			if(s>max)
				max=s;
		}
		x++;
	}
	return max;
}

void nhap(int A[][SIZE], int &n, int &k)
{
	cin>>n>>k;
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
		cin>>A[i][j];
}

void xuat(int kq)
{
	cout<<kq;
}

