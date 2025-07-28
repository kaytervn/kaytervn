#include<iostream>
#include<cmath>
void nhap(int &a, int &b, int &c);
int nghiem(int a, int b, int c, float &x1, float &x2);
void xuat(int kq, float x1, float x2);
using namespace std;
int main()
{
	int a,b,c;
	float x1,x2;
	nhap(a,b,c);
	int kq=nghiem(a,b,c,x1,x2);
	xuat(kq, x1, x2);
	return 0;
}
void nhap(int &a, int &b, int &c)
{
	cout<<"Phuong trinh: ax*x + b*x +c = 0"<<endl;
	cout<<"Nhap a: "; cin>>a;
	cout<<"Nhap b: "; cin>>b;
	cout<<"Nhap c: "; cin>>c;
}
int nghiem(int a, int b, int c, float &x1, float &x2)
{
	float dt=b*b-4*a*c;
	if (a==0)
	{
		if (b==0)
		{
			if (c==0) 
				return 1;
			else 
				return 0;
		}
		else
		{
			x1=-(float)c/b;
			return 2;
		}
	}
	else
	{
		if (dt<0) 
			return 0;
		else 
			if (dt==0)
			{
				x1=-(float)b/(2*a);
				return 3;
			}
			else
			{
				x1 =(-b+sqrt(dt))/(2*a);
				x2 =(-b-sqrt(dt))/(2*a);
				return 4;
			}
	}
}
void xuat(int kq, float x1, float x2)
{
	if (kq==0) 
		cout<<"Vo nghiem";
	else 
		if (kq==1) 
			cout<<"Nghiem tuy y";
		else 
			if (kq==2) 
				cout<<"x= "<<x1;
			else 
				if (kq==3) 
					cout<<"Nghiem kep x= " << x1;
				else 
				{
					cout<<"Hai nghiem phan biet"<<endl;
				    cout<< "x1=" << x1<<endl;
				    cout<< "x2=" << x2<<endl;
			    }
}
