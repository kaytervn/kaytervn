#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n);
int SoNguyenToTrongN(int n);
int kiemTraSoNguyenTo(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = SoNguyenToTrongN(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraSoNguyenTo(int n)
{
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}
int SoNguyenToTrongN(int n)
{
	int dem=0;
	for(int tmp; n!=0; n/=10)
	{
		tmp=n%10;
		if (kiemTraSoNguyenTo(tmp)!=0)
			dem++;
	}
	return dem;
}
void xuat(int kq)
{
	cout<<kq;
}
