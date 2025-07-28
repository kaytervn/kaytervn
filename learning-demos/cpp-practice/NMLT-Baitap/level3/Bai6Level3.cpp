#include<iostream>
using namespace std;
void nhap(int &n);
int demUocSo(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = demUocSo(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int demUocSo(int n)
{
	int dem=0;
	for(int i =1; i<=n; i++)
	{
		if (n % i ==0)
			dem++;
	}
	return dem;
}
void xuat(int kq)
{
	cout<<kq;
}
