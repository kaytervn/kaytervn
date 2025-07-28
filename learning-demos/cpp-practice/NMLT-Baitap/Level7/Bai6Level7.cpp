#include<iostream>
void nhap(int &n,int A[]);
int demSHH(int n, int A[]);
bool kiemTraSoHoanHao(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	int kq=demSHH(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
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

void xuat(int kq)
{
	cout<<kq;
}
