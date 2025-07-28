#include<iostream>
using namespace std;
void nhap(float &a, float &b, float &c);
int xetTamGiac (float a, float b, float c);
void xuat(int t);
int main()
{
	float a, b, c;
	nhap (a, b, c);
	int t=xetTamGiac(a, b, c);
	xuat (t);
	return 0;
}
void nhap(float &a, float &b, float &c)
{
	cout<<"Hay nhap do dai 3 canh!"<<endl;
	cout<<"Canh 1: "; cin>>a;
	cout<<"Canh 2: "; cin>>b;
	cout<<"Canh 3: "; cin>>c;
}
int xetTamGiac (float a, float b, float c)
{
	if ((a>0)&&(b>0)&&(c>0)&&(a+b>c)&&(b+c>a)&&(a+c>b))
	{
		if ((a==b)&&(b==c))
			return 1;
		else 
			if((a*a+b*b==c*c)||(a*a+c*c==b*b)||(b*b+c*c==a*a))
				return 2;
			else 
				if((a==b)||(a==c)||(b==c))
					return 3;
				else
					return 4;
	}
	else 
		return 0;
}
void xuat(int t)
{
		if (t==1)
			cout<<"Tam giac deu";
		else 
			if (t==2)
				cout<<"Tam giac vuong";
			else 
				if (t==3)
					cout<<"Tam giac can";
				else 
					if ((t==2)&&(t==3))
						cout<<"Tam giac vuong can";
					else 
						if (t==4)
							cout<<"Tam giac thuong";
						else
							cout<<"Khong phai tam giac";
}
