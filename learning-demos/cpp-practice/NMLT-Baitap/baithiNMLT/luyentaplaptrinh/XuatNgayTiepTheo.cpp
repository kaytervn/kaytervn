#include<iostream>
using namespace std;
void nhap(int &d, int &m, int &y);
int tinhNgayDenNamTiepTheo(int d, int m, int y, int &d1);
int tinhNgayTrongThang(int m, int y);
bool hopLe(int d, int m, int y);
bool namNhuan(int y);
void xuat(int k);

int main()
{
	int d,m,y,d1;
	nhap(d,m,y);
	int k=tinhNgayDenNamTiepTheo(d,m,y,d1);
	xuat(k);
	return 0;
}
void nhap(int &d, int &m, int &y)
{
	cin>>d>>m>>y;
}
int tinhNgayDenNamTiepTheo(int d, int m, int y, int &d1)
{
	if(hopLe(d,m,y)==0)
		return 0;
	else
	{
		d1=d;
		if(d1<tinhNgayTrongThang(m,y))
			d1++;
		else
			d1=1;
		return d1;
	}
}

int tinhNgayTrongThang(int m, int y)
{
	if(m==4 || m==6 || m==9 ||m==11)
		return 30;
	else
		if(m==2)
			if(namNhuan(y)==1)
				return 29;
			else
				return 28;
		else
			return 31;
}
bool hopLe(int d, int m, int y)
{
	return d>0 && d<=tinhNgayTrongThang(m,y) && m>0 && m<13 && y>0 && y<10000;
}
bool namNhuan(int y)
{
	return ((y % 4 == 0 && y % 100 != 0) || y % 400 ==0);
}
void xuat(int k)
{
	cout<<k;
}
