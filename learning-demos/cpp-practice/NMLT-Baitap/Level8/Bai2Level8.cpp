#include<iostream>
void nhap(int &n,int A[]);
bool haiSo0(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=haiSo0(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool haiSo0(int n, int A[])
{
	for(int i=0;i<n-1;i++)
	{
		if(A[i]==0 && A[i+1]==0)
			return 1;
	}
	return 0;
}

void xuat(int n)
{
	if(n)
		cout<<"Co 2 so 0 lien tiep";
	else
		cout<<"KHONG co 2 so 0 lien tiep";
}
