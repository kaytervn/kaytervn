#include<iostream>
using namespace std;
void nhap(int &n);
int soHoanHao(int n);
void xuat(int kq);
int main ()
{
	int n;
	nhap(n);
	int kq = soHoanHao(n);
	xuat(kq);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int soHoanHao(int n)
{
	int s=0;
	for(int i=1; i<= n/2; i++)
	{
		if (n%i == 0)
			s+= i;
	}
	if (s==n)
		return 1;
	else
		return 0;
}
void xuat(int kq)
{
	if(kq==1)
		cout<<"la so hoan hao";
	else
		cout<<"khong la so hoan hao";
}
