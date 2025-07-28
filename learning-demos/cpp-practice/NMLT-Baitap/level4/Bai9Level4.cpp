#include<iostream>
using namespace std;
void nhap(int &n);
int kiemTraGiamDan(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = kiemTraGiamDan(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraGiamDan(int n)
{
	int cuoi=n%10;
	n /= 10;
	while(n!=0)
	{
		int keCuoi=n%10;
		n /=10;
		if(keCuoi>cuoi)
			cuoi=keCuoi;
		else
			return 0;
	}
	return 1;
}
void xuat(int kq)
{
	if(kq==0)
		cout<<"khong giam dan";
	else
		cout<<"giam dan";
}
