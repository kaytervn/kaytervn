#include<iostream>
#define SIZE 100
void xuat();

void sangEratosthene();
void khoiTao();
using namespace std;

int check[SIZE],n;

int main()
{
	
	cin>>n;
	khoiTao();
	sangEratosthene();
	xuat();
	return 0;
}

void xuat()
{
	for(int i=2;i<=n;i++)
		if(check[i]==1)
			cout<<i<<" ";
}

void sangEratosthene()
{
	for(int i=2;i<=n;i++)
	{
		if(check[i]==1)
		{
			for(int j=2*i;j<=n;j+=i)
				check[j]=0;
		}
	}
}

void khoiTao()
{
	for(int i=2;i<=n;i++)
		check[i]=1;
}
