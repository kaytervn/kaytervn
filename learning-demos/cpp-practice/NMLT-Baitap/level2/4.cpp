#include<iostream>
void nhap(int &m, int &y);
int kiemTra(int m, int y);
void xuat(int c);
using namespace std;
int main()
{
	int m, y;
	nhap(m, y);
	int c=kiemTra(m, y);
	xuat(c);
	return 0;
}
void nhap(int &m, int &y)
{
	cout<<"Thang: "; cin>>m;
	cout<<"Nam: "; cin>>y;
}
int kiemTra(int m, int y)
{
	if (m>=1 && m<=12 && y>0)
	{
		if (m==4||m==6||m==9||m==11)
			return 30;
		else 
			if (m==2)
			{
				if (((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) ==1)
					return 29;
				else 
					return 28;
			}
			else 
				return 31;
	}
	else 
		return 0;
}
void xuat(int c)
{
	if (c==0) 
		cout<<"Nhap sai!";
	else 
		cout<<"So ngay trong thang: "<<c;
}
