#include <iostream>
void nhap(int &h, int &m, int&s );
int kiemtra(int h, int m, int s);
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
int kiemtra(int h, int m, int s)
{
	if ((h>=0 && h<=23) && (m>=0 && m<=59) && (s>=0 && s<=59)) return 1;
	else return 0;
}
void xuat(int t, int h, int m, int s)
{
	if (t==1)
	printf("Thoi gian da nhap la %d gio %d phut %d giay la hop le!", h, m, s);
	else
	cout<<"Thoi gian da nhap khong hop le!";
}
