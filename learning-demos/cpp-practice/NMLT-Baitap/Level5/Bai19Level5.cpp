#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &d, int &m, int &y,int &d1, int &m1, int &y1);
int tinhKhoangCachGiua2Ngay(int d, int m, int y, int d1, int m1, int y1);
int soNgayTrongNam(int y);
int soNgayThuBaoNhieuTrongNam(int d, int m, int y);
bool hopLe(int d, int m, int y);
int tinhNgayTrongThang(int m, int y);
bool namNhuan(int y);
void xuat(int k);
int main()
{
	int d,m,y,d1,m1,y1;
	nhap(d,m,y,d1,m1,y1);
	int k=tinhKhoangCachGiua2Ngay(d,m,y,d1,m1,y1);
	xuat(k);
	return 0;
}
void nhap(int &d, int &m, int &y,int &d1, int &m1, int &y1)
{
	cin>>d>>m>>y>>d1>>m1>>y1;
}
int tinhKhoangCachGiua2Ngay(int d, int m, int y, int d1, int m1, int y1)
{
	if(hopLe(d,m,y)==1 && hopLe(d1,m1,y1)==1)
	{
		int nd1=soNgayThuBaoNhieuTrongNam(d,m,y)+ y*soNgayTrongNam(y);
		int nd2=soNgayThuBaoNhieuTrongNam(d1,m1,y1)+ y1*soNgayTrongNam(y1);
		return abs(nd2-nd1) +1;
	}
	else
		return 0;
}
int soNgayTrongNam(int y)
{
	if(namNhuan(y)==1)
		return 366;
	else
		return 365;
}
int soNgayThuBaoNhieuTrongNam(int d, int m, int y)
{
	int dem=d;
	for(int i=1; i< m; i++)
		dem= dem + tinhNgayTrongThang(i,y);
	return dem;
}
bool hopLe(int d, int m, int y)
{
	return d>0 && d<=tinhNgayTrongThang(m,y) && m>0 && m<13 && y>0;
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
bool namNhuan(int y)
{
	return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
}
void xuat(int k)
{
	if(k==0)
		cout<<"Khong hop le";
	else
		cout<<k;
}
