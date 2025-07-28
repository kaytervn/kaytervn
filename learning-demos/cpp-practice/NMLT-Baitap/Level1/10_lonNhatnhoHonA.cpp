#include<iostream>
void nhap(double &a);
int kiemTra(double a);
void xuat(int k);
using namespace std;
int main()
{
	double a;
	nhap(a);
	int k=kiemTra(a);
	xuat(k);
	return 0;
}
void nhap(double &a)
{
	cout<<"So thuc a: "; cin>>a;
}
int kiemTra(double a)
{
	int h;
		if ((a-int(a))==0)
			h=int(a)-1;
		else h=int(a);
	return h;
}
void xuat(int k)
{
	cout<<"So nguyen lon nhat va nho hon a la: "<<k;
}
