#include<iostream>
using namespace std;
void nhap(int &n);
int NcoToanSoChan(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = NcoToanSoChan(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int NcoToanSoChan(int n)
{
	while (n != 0) 
	{
		int tmp = n % 10;
		if (tmp % 2 != 0)
			return 0;
		n /= 10;
	}
	return 1;
}
void xuat(int kq)
{
	if(kq==1)
		cout<<"gom toan so chan";
	else
		cout<<"khong gom toan so chan";
}
