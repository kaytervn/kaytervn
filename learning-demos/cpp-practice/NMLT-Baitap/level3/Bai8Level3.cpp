#include<iostream>
using namespace std;
void nhap(int &n);
int reverse(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = reverse(n);
	xuat (kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int reverse(int n)
{
	int rev=0;
	for(int r; n>0; n=n/10)
	{
		r = n%10;
		rev = rev*10 +r;	
	}
	return rev;
}
void xuat(int kq)
{
	cout<<kq;
}
