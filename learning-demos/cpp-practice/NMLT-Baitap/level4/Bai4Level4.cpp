#include<iostream>
using namespace std;
void nhap(int &n);
int soDoiXung(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = soDoiXung(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int soDoiXung(int n)
{
	int tmp=n, s=0;
	for(int r; n>0; n/= 10)
	{
		r =n%10;
		s= s*10 +r;
	}
	if (s==tmp)
		return 1;
	else
		return 0;
}
void xuat(int kq)
{
	if(kq==1)
		cout<<"la so doi xung";
	else
		cout<<"khong la so doi xung";
}
