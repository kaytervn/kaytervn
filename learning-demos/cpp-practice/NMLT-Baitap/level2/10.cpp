#include <iostream>
void nhap(int &h, int &m, int&s );
int kiemtra(int &h, int &m, int &s);
void xuat(int t, int h, int m, int s);
using namespace std;
int main() 
{
    int h,m,s;
    nhap (h, m, s);
    int t=kiemtra(h, m, s);
	xuat (t, h, m, s);
    return 0;
}
void nhap(int &h, int &m, int &s)
{
	cout<<"Nhap gio: "; cin>>h;
	cout<<"Nhap phut: "; cin>>m;
	cout<<"Nhap giay: "; cin>>s;
}
int kiemtra(int &h, int &m, int &s)
{
	if (h>=0 && h<=23 && m>=0 && m<=59 && s>=0 && s<=59)
	{
		if (s==59)
		{
			s=0;
			if (m==59)
			{
				m=0;
				if (h==23) h=0;
				else h++;
			}
			else 
				m++;
		}
		else 
			s++;
	}
	else 
		return 0;
}
void xuat(int t, int h, int m, int s)
{
	if (t==0) cout<<"Thoi gian da nhap khong hop le!";
	else
	printf("Thoi gian sau do [1 giay] la %d gio %d phut %d giay!", h, m, s);
}
