#include<iostream>
using namespace std;
void nhap(int &n);
int kiemTraTangDan(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = kiemTraTangDan(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraTangDan(int n)
{
	int cuoi=n%10;
	n /= 10;
	while(n!=0)
	{
		int keCuoi=n%10;
		n /=10;
		if(keCuoi<cuoi)
			cuoi=keCuoi;
		else
			return 0;
	}
	return 1;
}
void xuat(int kq)
{
	if(kq==0)
		cout<<"khong tang dan";
	else
		cout<<"tang dan";
}
