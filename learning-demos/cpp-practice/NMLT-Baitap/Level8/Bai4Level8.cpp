#include<iostream>
void nhap(int &n,int A[]);
int GTdauTiendauLe(int n, int A[]);
bool checkSoDauLe(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	int kq= GTdauTiendauLe(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int GTdauTiendauLe(int n, int A[])
{
	for(int i=0;i<n;i++)
	{
		if(checkSoDauLe(A[i]))
			return A[i];
	}
	return 0;
}

bool checkSoDauLe(int n)
{
	while(n>=10)
		n /=10;
	if(n%2!=0)
		return 1;
	else
		return 0;
}

void xuat(int n)
{
	cout<<n;
}
