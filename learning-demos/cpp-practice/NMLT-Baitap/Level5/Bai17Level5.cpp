#include<iostream>
using namespace std;
void nhap(int &d, int &m, int &y);
int soNgayThuBaoNhieuTrongNam(int d, int m, int y);
void xuat(int k);
bool hopLe(int d, int m, int y);
bool namNhuan(int y);
int tinhNgayTrongThang(int m, int y);
int main()
{
	int d,m,y;
	nhap(d,m,y);
	int k=soNgayThuBaoNhieuTrongNam(d,m,y);
	xuat(k);
	return 0;
}
void nhap(int &d, int &m, int &y)
{
	cin>>d>>m>>y;
}
int soNgayThuBaoNhieuTrongNam(int d, int m, int y)
{
	int dem=d;
	if(hopLe(d,m,y)==1)
		{
			for(int i=1; i< m; i++)
				dem= dem + tinhNgayTrongThang(i,y);
			return dem;
		}
	else
		return 0;
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
	return (y % 4 == 0 && y % 100 != 0) || y % 400 ==0;
}
void xuat(int k)
{
	if(k==0)
		cout<<"Khong hop le";
	else
		cout<<k;
}
