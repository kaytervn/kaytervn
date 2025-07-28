#include<iostream>
using namespace std;

void nhap(int &d, int &m, int &y);
void ngayTiepTheo(int d, int m, int y, int &d1, int &m1, int &y1);
int quy(int m);
void ngayTruoc(int d, int m, int y, int &d1, int &m1, int &y1);
int tinhNgayTrongThang(int m, int y);
bool hopLe(int d, int m, int y);
bool namNhuan(int y);
void xuat(int d, int m, int y, int &d1, int &m1, int &y1, int &d2, int &m2, int &y2);

int main()
{
	int d,m,y,d1,m1,y1,d2,m2,y2;
	nhap(d,m,y);
	xuat(d,m,y,d1,m1,y1,d2,m2,y2);
	return 0;
}

void nhap(int &d, int &m, int &y)
{
	cin>>d>>m>>y;
}

void ngayTiepTheo(int d, int m, int y, int &d1, int &m1, int &y1)
{
	d1=d;
	m1=m;
	y1=y;
	if(d1<tinhNgayTrongThang(m,y))
		d1++;
	else
	{
		d1=1;
		if(m1<12)
			m1++;
		else
		{
			m1=1;
			y1++;
		}
	}
}

int quy(int m)
{
	switch(m)
	{
		case 1:
		case 2:
		case 3:
			return 1;
		case 4:
		case 5:
		case 6:
			return 2;
		case 7:
		case 8:
		case 9:
			return 3;
		case 10:
		case 11:
		case 12:
			return 4;
	}
}

void ngayTruoc(int d, int m, int y, int &d1, int &m1, int &y1)
{
	d1=d;
	m1=m;
	y1=y;
	if(d1<=tinhNgayTrongThang(m,y) && d1>1)
		d1--;
	else
		if(d1==1)
		{
			if(m1>1&&m1<=12)
				m1--;
			else
				if(m1==1)
				{
					m1=12;
					y1--;
				}
			d1=tinhNgayTrongThang(m1,y1);
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
	return d>0 && d<=tinhNgayTrongThang(m,y) && m>0 && m<13 && y>0;
}

bool namNhuan(int y)
{
	return ((y % 4 == 0 && y % 100 != 0) || y % 400 ==0);
}

void xuat(int d, int m, int y, int &d1, int &m1, int &y1, int &d2, int &m2, int &y2)
{
	if(hopLe(d,m,y))
	{
		ngayTiepTheo(d,m,y,d1,m1,y1);
		ngayTruoc(d,m,y,d2,m2,y2);
		cout<<"HOP LE"<<endl;
		cout<<quy(m)<<endl;
		cout<<tinhNgayTrongThang(m,y)<<endl;
		cout<<d1<<" "<<m1<<" "<<y1<<endl;
		cout<<d2<<" "<<m2<<" "<<y2;
	}
	else
		cout<<"KHONG HOP LE";
}
