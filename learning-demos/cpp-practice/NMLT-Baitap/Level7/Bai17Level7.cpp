#include<iostream>
void nhap(int &n,int A[]);
int toanSHH(int n, int A[]);
bool kiemTraSoHoanHao(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=toanSHH(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int toanSHH(int n, int A[])
{
	for(int i=0;i<n;i++)
	{
		if(kiemTraSoHoanHao(A[i])==0)
			return 0;
	}
	return 1;
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
	if(kq)
		cout<<"Toan SHH";
	else
		cout<<"KHONG toan SHH";
}
