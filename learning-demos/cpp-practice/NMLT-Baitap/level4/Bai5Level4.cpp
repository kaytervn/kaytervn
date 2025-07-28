#include<iostream>
using namespace std;
void nhap(int &n);
int soLonNhatTrongN(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = soLonNhatTrongN(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int soLonNhatTrongN(int n)
{
	int max=0;
	for(int tmp; n!=0; n = n/10)
	{
		tmp = n%10;
		if (tmp>max)
			max=tmp;
	}
	return max;
}
void xuat(int kq)
{
	cout<<kq;
}
