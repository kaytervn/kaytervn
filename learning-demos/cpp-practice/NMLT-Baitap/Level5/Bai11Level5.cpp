#include<iostream>
using namespace std;
void nhap(int &n);
int tongCacGiaiThua(int n);
void xuat(int kq);
int main()
{
	int n;
	nhap(n);
	int kq=tongCacGiaiThua(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int tongCacGiaiThua(int n)
{
	int s=0; 
	int p=1;
	for(int i=1; i<=n; i++)
	{
		p *= i;
		s += p;
	}
	return s;
}
void xuat(int kq)
{
	cout<<kq;
}

