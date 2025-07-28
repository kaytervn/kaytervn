#include<iostream>
#include<cmath>
using namespace std;

void nhap(int &d, int &m, int &y);
void xuat(int d, int m, int y);
void ngayLienSau1ngay(int &d, int &m, int &y);
bool hopLe(int d, int m, int y);
int ktNamNhuan(int y);
int tinhNgayTrongThang(int m, int y);

int main()
{
	int d,m,y;
	nhap(d,m,y);
	if(hopLe(d,m,y)==1)
	{
		ngayLienSau1ngay(d,m,y);
		xuat(d,m,y);
	}
	else
		cout<<"Ngay thang nam khong hop le!";
	

	return 0;
}

void nhap(int &d, int &m, int &y)
{
	cin>>d>>m>>y;
}

void xuat(int d, int m, int y)
{
	cout<<d<<"/"<<m<<"/"<<y;
}

void ngayLienSau1ngay(int &d, int &m, int &y)
{
	d++;
	if(d>tinhNgayTrongThang(m,y))
	{
		d=1;
		m++;
		if(m>12)
		{
			m=1;
			y++;
		}
	}
}

bool hopLe(int d, int m, int y)
{
	return d>0 && d<=tinhNgayTrongThang(m,y) && m>0 && m<13 && y>0;
}

int ktNamNhuan(int y)
{ 
	return(y>0 && (y%4==0 && y%100!=0 || y%400==0) );
}

int tinhNgayTrongThang(int m, int y)
{
	int M[]={0, 31, 28, 31, 30, 31, 30, 30, 31, 31, 30, 31, 30, 31};
	
	if(ktNamNhuan(y)==1)
		M[2]=29;

	return M[m];
}
