#include<iostream>
void nhap(int &a, int &b);
int nghiem(int a, int b, float &x);
void xuat(int kq, float x);
using namespace std;
int main()
{
	int a, b;
	float x;
	nhap(a, b);
	int kq=nghiem(a,b,x);
	xuat(kq,x);
	return 0;
}
void nhap(int &a, int &b)
{
	cout<<"Phuong trinh: ax+b=0"<<endl;
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
}
int nghiem(int a, int b, float &x)
{
	if (a==0)
	{
		if (b==0) 
			return 1;
		else 
			return 0;
	}
	else
	{
		x=-(float)b/a;
		return 2;
	}
}
void xuat(int kq, float x)
{
	if (kq==0) 
		cout<<"Vo nghiem";
	else 
	{
		if (kq==1) 
			cout<<"Nghiem tuy y";
		else 
			cout<<"x= "<<x;
	}

}
