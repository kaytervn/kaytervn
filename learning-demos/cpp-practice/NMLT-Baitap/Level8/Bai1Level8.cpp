#include<iostream>
void nhap(int &n,int A[]);
bool checkChanLe(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=checkChanLe(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool checkChanLe(int n, int A[])
{
	for(int i=0;i<n-1;i++)
	{
		if((A[i]+A[i+1]) %2 == 0)
			return 0;
	}
	return 1;
}

void xuat(int n)
{
	if(n)
		cout<<"Co tinh chan le";
	else
		cout<<"KHONG co tinh chan le";
}
