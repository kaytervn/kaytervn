#include<iostream>
void nhap(int &n,int A[]);
bool checkSoLe(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	bool kq=checkSoLe(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool checkSoLe(int n, int A[])
{
	for(int i=0;i<n;i++)
	{
		if(A[i]%2==0)
			return 0;
	}
	return 1;
}

void xuat(int n)
{
	if(n)
		cout<<"Toan so le";
	else
		cout<<"Khong toan so le";
}
