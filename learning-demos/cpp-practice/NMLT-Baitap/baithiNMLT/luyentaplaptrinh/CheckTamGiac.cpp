#include<iostream>
using namespace std;
void nhap(int &a, int &b, int &c);
int xetTamGiac (int a, int b, int c);
void xuat(int t);
int main()
{
	int a, b, c;
	nhap (a, b, c);
	int t=xetTamGiac(a, b, c);
	xuat (t);
	return 0;
}
void nhap(int &a, int &b, int &c)
{
	cin>>a>>b>>c;
}
int xetTamGiac (int a, int b, int c)
{
	if ((a>0)&&(b>0)&&(c>0)&&(a+b>c)&&(b+c>a)&&(a+c>b))
	{
		if ((a==b)&&(b==c))
			return 0;
		else 
			if((a*a+b*b==c*c)||(a*a+c*c==b*b)||(b*b+c*c==a*a))
				return 2;
			else 
				if((a==b)||(a==c)||(b==c))
					return 1;
				else
					return 3;
	}
	else 
		return 4;
}
void xuat(int t)
{
	cout<<t;
}
