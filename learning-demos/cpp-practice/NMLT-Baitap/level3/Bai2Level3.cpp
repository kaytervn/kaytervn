#include<iostream>
using namespace std;
void nhap(int &n);
int tongS(int n);
void xuat(int kq);
int main()
{
	int n;
	nhap(n);
	int kq=tongS(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int tongS(int n)
{
	int s=0;
	for(int i=1; i<=n; i++)
	{
		s= s+ i*i;
	}
	return s;
}
void xuat(int kq)
{
	cout<<kq;
}
