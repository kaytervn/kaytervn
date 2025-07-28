#include<iostream>
#include<cmath>
using namespace std;

int xuLy(int l, int r);
int demUocSo(int n);
void nhap(int &l, int &r);
void xuat(int a);

int main()
{
	int l,r;
	nhap(l,r);
	int dem=xuLy(l,r);
	xuat(dem);
	return 0;
}

int xuLy(int l, int r)
{
	int dem=0;
	for(int i=l;i<=r;i++)
		if(demUocSo(i)==3)
			dem++;
	return dem;
}

int demUocSo(int n)
{
	int dem=0;
	for(int i=1;i<=n;i++)
		if(n%i==0)
			dem++;
	return dem;
}

void nhap(int &l, int &r)
{
	cin>>l>>r;
}

void xuat(int a)
{
	cout<<a;
}
