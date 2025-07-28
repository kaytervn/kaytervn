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
void xuatNamNhuan(DATE a);
void soThuTuNgayTrongNam(DATE a);
DATE ngayLienTruoc1ngay(DATE a);
DATE ngayLienTruocKngay(DATE a, int k);
DATE ngayLienSau1ngay(DATE a);
DATE ngayLienSauKngay(DATE a, int k);
void xuatSTTtu111(DATE a);
void nhap(int &a);
void xuatNgayLienTruocKngay(DATE a, int k);
void xuatNgayLienSauKngay(DATE a, int k);
void xuatSS2ngay(DATE a, DATE b);
int soSanh2ngay(DATE a, DATE b);

int main()
{
	DATE a, b;
	int kc, k;
	
	cout<<"Nhap k: ";
	nhap(k);
	
	cout<<"\t\tINSERT DATE I: \n";
	nhapD(a);
	cout<<"\nDATE I: \n";
	xuatD(a);

	cout<<"\n\n\t\tINSERT DATE II: \n";
	nhapD(b);
	cout<<"\nDATE II: \n";
	xuatD(b);
	
	cout<<"\n\nNAM NHUAN:\n";
	xuatNamNhuan(a);
	xuatNamNhuan(b);
	
	cout<<"\n\nSO THU TU NGAY TRONG NAM:\n";
	soThuTuNgayTrongNam(a);
	soThuTuNgayTrongNam(b);
	
	cout<<"\n\nSO THU TU NGAY KE TU 1/1/1:\n";
	xuatSTTtu111(a);
	xuatSTTtu111(b);

	kc= khoangCachD(a,b);
	cout<<"\nKHOANG CACH GIUA 2 NGAY: ";
	xuat(kc);
	
	cout<<"\nNGAY LIEN TRUOC K NGAY: \n";
	xuatNgayLienTruocKngay(a,k);
	xuatNgayLienTruocKngay(b,k);
	
	cout<<"\nNGAY LIEN SAU K NGAY: \n";
	xuatNgayLienSauKngay(a,k);
	xuatNgayLienSauKngay(b,k);
	
	cout<<"\nSO SANH 2 NGAY: \n";
	xuatSS2ngay(a,b);

	return 0;
}

void xuatSS2ngay(DATE a, DATE b)
{
	cout<<"Ngay ";
	xuatD(a);

	if(soSanh2ngay(a,b)==-1)
		cout<<" = ";
	else
		if(soSanh2ngay(a,b)==1)
			cout<<" sau ";
		else
			cout<<" truoc ";

	cout<<"ngay ";
	xuatD(b);
}

int soSanh2ngay(DATE a, DATE b)
{
	if(a.y==b.y)
	{
		if(a.m==b.m)
		{
			if(a.d==b.d)
			{
				return -1;
			}
			else
				if(a.d>b.d)
					return 1;
				else
					return 0;
		}
		else
			if(a.m>b.m)
				return 1;
			else
				return 0;
	}
	else
		if(a.y>b.y)
			return 1;
		else
			return 0;
}

void xuatNgayLienTruocKngay(DATE a, int k)
{
	cout<<"Ngay lien truoc ngay ";
	xuatD(a);
	cout<<" "<<k<<" ngay la: ";
	xuatD(ngayLienTruocKngay(a,k));
	cout<<endl;
}

void xuatNgayLienSauKngay(DATE a, int k)
{
	cout<<"Ngay lien sau ngay ";
	xuatD(a);
	cout<<" "<<k<<" ngay la: ";
	xuatD(ngayLienSauKngay(a,k));
	cout<<endl;
}

void xuatSTTtu111(DATE a)
{
	int kq=tinhSoNgay(a.d,a.m,a.y);
	cout<<"So thu tu tu ngay 1/1/1 den ngay ";
	xuatD(a);
	cout<<" la: "<<kq<<endl;
}

void nhap(int &a)
{
	cin>>a;
}

DATE ngayLienSau1ngay(DATE a)
{
	++a.d;
	if(a.d>tinhNgayTrongThang(a.m,a.y))
	{
		a.d=1;
		++a.m;
		if(a.m>12)
		{
			a.m=1;
			++a.y;
		}
	}
	return a;
}

DATE ngayLienSauKngay(DATE a, int k)
{
	DATE tmp=a;
	for(int i=0;i<k;i++)
		tmp= ngayLienSau1ngay(tmp);
	return tmp;
}

DATE ngayLienTruoc1ngay(DATE a)
{
	--a.d;
	if(a.d==0)
	{
		--a.m;
		if(a.m==0)
		{
			a.m=12;
			--a.y;
		}
		 
		a.d=tinhNgayTrongThang(a.m,a.y);
	}
	return a;
}

DATE ngayLienTruocKngay(DATE a, int k)
{
	DATE tmp=a;
	for(int i=0;i<k;i++)
		tmp= ngayLienTruoc1ngay(tmp);
	return tmp;
}

void soThuTuNgayTrongNam(DATE a)
{
	int stt=soNgayThuBaoNhieuTrongNam(a.d,a.m,a.y);
	
	cout<<"Ngay ";
	xuatD(a);
	cout<<" la ngay thu "<<stt<<" trong nam!\n";
}

void xuatNamNhuan(DATE a)
{
	cout<<"Ngay ";
	xuatD(a);
	if(ktNamNhuan(a.y)==1)
		cout<<" trong nam nhuan!\n";
	else
		cout<<" trong nam KHONG nhuan!\n";
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
	cout<<a.d<<"/"<<a.m<<"/"<<a.y;
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
