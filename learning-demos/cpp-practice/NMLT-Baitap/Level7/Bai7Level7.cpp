#include<iostream>
void nhap(int &n,int A[]);
int tongSCP(int n, int A[]);
bool kiemTraSoChinhPhuong(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	int kq=tongSCP(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int tongSCP(int n, int A[])
{
	int s=0;
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoChinhPhuong(A[i])==1)
			s += A[i];
	}
	return s;
}

bool kiemTraSoChinhPhuong(int n)
{
	int i=0;
	while(i*i <=n)
	{
		if(i*i==n)
			return 1;
		i++;
	}
	return 0;
}

void xuat(int kq)
{
	cout<<kq;
}
