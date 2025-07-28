#include<iostream>
void nhap(int &n,int A[]);
bool toanSCP(int n, int A[]);
bool kiemTraSoChinhPhuong(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=toanSCP(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool toanSCP(int n, int A[])
{
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoChinhPhuong(A[i])==0)
			return 0;
	}
	return 1;
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
	if(kq)
		cout<<"Toan SCP";
	else
		cout<<"KHONG toan SCP";
}
