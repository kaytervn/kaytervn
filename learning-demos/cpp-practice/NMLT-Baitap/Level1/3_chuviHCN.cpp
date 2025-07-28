#include<iostream>
void nhap(double &a, double &b);
double tinhChuvi(double a, double b);
void xuat(double cv);
using namespace std;
int main()
{
	double a, b;
	nhap(a, b);
	double cv=tinhChuvi(a, b);
	xuat(cv);
	return 0;
}
void nhap(double &a, double &b)
{
	cout<<"HINH CHU NHAT CO: "<<endl;
	cout<<"Chieu dai: "; cin>>a;
	cout<<"Chieu rong: "; cin>>b;
}
double tinhChuvi(double a, double b)
{
	if ((a>b)&&(a>0)&&(b>0))
	{
		double k=(a+b)*2;
		return k;
	}
	else return false;
}
void xuat(double cv)
{
	if (cv==false)
	cout<<"Nhap sai kich thuoc!";
	else
	printf("Chu vi HCN la %.2f",cv);
}
