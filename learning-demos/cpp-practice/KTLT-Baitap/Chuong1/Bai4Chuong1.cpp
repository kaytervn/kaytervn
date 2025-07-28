#include<iostream>
#include<cmath>
using namespace std;

struct DATE
{
	unsigned int d;
	unsigned int m;
	unsigned int y;
};

int tinhNgayTrongNam(int y);
int khoangCachD(DATE a, DATE b);
void xuat(int a);
void nhapD(DATE &a);
bool hopLe(int d, int m, int y);
int ktNamNhuan(int y);
int tinhNgayTrongThang(int m, int y);
void xuatD(DATE a);
int soNgayThuBaoNhieuTrongNam(int d, int m, int y);
int tinhSoNgay(int d, int m, int y);

int main()
{
	DATE a, b;
	int kc;

	cout<<"\t\tINSERT DATE I: \n";
	nhapD(a);
	cout<<"\nDATE I: \n";
	xuatD(a);

	cout<<"\n\t\tINSERT DATE II: \n";
	nhapD(b);
	cout<<"\nDATE II: \n";
	xuatD(b);

	kc= khoangCachD(a,b);
	cout<<"\n\t\tKHOANG CACH GIUA 2 NGAY: \n";
	xuat(kc);

	return 0;
}

int tinhSoNgay(int d, int m, int y)
{
	int kq=0;
	for(int i=1; i<y;i++)
	{
		if(ktNamNhuan(i)==1)
			kq += 366;
		else
			kq += 365;
	}
	
	kq += soNgayThuBaoNhieuTrongNam(d,m,y);
	return kq;
}

int khoangCachD(DATE a, DATE b)
{
	DATE date;
	int d1,d2,kc;
	d1=tinhSoNgay(a.d,a.m,a.y);
	d2=tinhSoNgay(b.d,b.m,b.y);

	kc=abs(d1-d2);
	return kc;
}

int soNgayThuBaoNhieuTrongNam(int d, int m, int y)
{
	int dem=d;
	for(int i=1; i< m; i++)
		dem= dem + tinhNgayTrongThang(i,y);
	return dem;
}

void xuatD(DATE a)
{
	cout<<a.d<<"/"<<a.m<<"/"<<a.y<<endl;
}

void xuat(int a)
{
	cout<<a<<endl;
}

void nhapD(DATE &a)
{
	cout<<"Nhap NGAY: ";
	cin>>a.d;
	
	cout<<"Nhap THANG: ";
	cin>>a.m;
	
	cout<<"Nhap NAM: ";
	cin>>a.y;
	
	while(hopLe(a.d,a.m,a.y)==0)
	{
		cout<<"Vui long nhap NGAY, THANG, NAM hop le!\n";
		nhapD(a);
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
	if(m==4||m==6||m==9||m==11)
		return 30;
	else 
		if(m==2)
		{
			if(ktNamNhuan(y)==1)
				return 29;
			else 
				return 28;
		}
		else 
			return 31;
}
