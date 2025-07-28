#include<iostream>
using namespace std;
void nhap(int &a, int &b);
int uocChungLonNhat(int a, int b);
void xuat(int kq);
int main ()
{
	int a,b;
	nhap(a,b);
	int kq = uocChungLonNhat(a,b);
	xuat (kq);
	return 0;
}
void nhap(int &a, int &b)
{
	cin>>a>>b;
}
int uocChungLonNhat(int a, int b)
{
	while(a!=b)
	{
		if (a>b)
			a-= b;
		else
			b-= a;
	}
	return a;
}
void xuat(int kq)
{
	cout<<kq;
}
