#include<iostream>
using namespace std;
void nhap(int &n, int &k);
int tinhToHop(int n, int k);
int gt(int n);
void xuat(int kq);
int main()
{
	int n, k;
	nhap(n, k);
	int kq=tinhToHop(n, k);
	xuat(kq);
	return 0;
}
void nhap(int &n, int &k)
{
	cin>>n>>k;
}
int gt(int n)
{
	int g=1;
	for(int i=1; i<=n; i++)
		g *= i;
	return g;
}
int tinhToHop(int n, int k)
{
	return gt(n)/ (gt(k) * gt(n-k));
}
void xuat(int kq)
{
	cout<<kq;
}
