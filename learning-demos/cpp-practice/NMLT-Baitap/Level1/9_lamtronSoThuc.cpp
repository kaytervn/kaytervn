#include<iostream>
void nhap(double &a);
int lamTron(double a);
void xuat(int k);
using namespace std;
int main()
{
	double a;
	nhap(a);
	int k=lamTron(a);
	xuat(k);
	return 0;
}
void nhap(double &a)
{
	cout<<"So thuc can lam tron: "; cin>>a;
}
int lamTron(double a)
{
	int h;
		if ((a-int(a))>=0.5)
			h=int(a)+1;
		else h=int(a);
	return h;
}
void xuat(int k)
{
	cout<<"So sau khi duoc lam tron: "<<k;
}
