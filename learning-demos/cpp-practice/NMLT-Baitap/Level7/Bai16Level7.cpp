#include<iostream>
#include<cmath>
void nhap(int &n,int A[]);
bool soSanhSNT_SHH(int n,int A[]);
int demSHH(int n, int A[]);
bool kiemTraSoHoanHao(int n);
int demSNT(int n, int A[]);
int kiemTraSoNguyenTo(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=soSanhSNT_SHH(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool soSanhSNT_SHH(int n,int A[])
{
	return demSHH(n,A)==demSNT(n,A);
}

int demSHH(int n, int A[])
{
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoHoanHao(A[i])==1)
			dem++;
	}
	return dem;
}

bool kiemTraSoHoanHao(int n)
{
	int s=0;
	for(int i=1; i<= n/2; i++)
	{
		if (n%i == 0)
			s+= i;
	}
	if (s==n)
		return 1;
	else
		return 0;
}

int demSNT(int n, int A[])
{
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoNguyenTo(A[i])!=0)
			dem++;
	}
	return dem;
}

int kiemTraSoNguyenTo(int n)
{
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}

void xuat(int kq)
{
	if(kq)
		cout<<"so luong SHH = so luong SNT";
	else
		cout<<"so luong SHH != so luong SNT";
}
