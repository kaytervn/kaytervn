#include<iostream>
#include<cmath>
using namespace std;

struct PHANSO
{
	int tuso;
	int mauso;
};

void xuat1PS(PHANSO a);
void nhapPS(PHANSO &a);
PHANSO thuong2PS(PHANSO a, PHANSO b);
PHANSO tich2PS(PHANSO a, PHANSO b);
PHANSO hieu2PS(PHANSO a, PHANSO b);
PHANSO tong2PS(PHANSO a, PHANSO b);
PHANSO rutGon1PS(PHANSO a);
PHANSO xuLyDauTru(PHANSO a);
int UCLN(int a, int b);
PHANSO quiDong2PS(PHANSO a, PHANSO b);
void xuatSS(PHANSO a, PHANSO b);
int soSanh2PS(PHANSO a, PHANSO b);
void xuatAmDuong(PHANSO a);
int ktAmDuong(PHANSO a);

int main()
{
	PHANSO a,b;
	cout<<"\t\tNhap PHAN SO thu I: \n";
	nhapPS(a);
	cout<<"\n\t\tNhap PHAN SO thu II: \n";
	nhapPS(b);
	
	cout<<"\n\t\tCAC PHEP TINH: \n";
	cout<<"Tong: ";
	xuat1PS(tong2PS(a,b));
	
	cout<<"Hieu: ";
	xuat1PS(hieu2PS(a,b));
	
	cout<<"Tich: ";
	xuat1PS(tich2PS(a,b));
	
	cout<<"Thuong: ";
	xuat1PS(thuong2PS(a,b));
	
	cout<<"\n\t\tPHAN SO RUT GON: \n";
	xuat1PS(rutGon1PS(a));
	xuat1PS(rutGon1PS(b));
	
	cout<<"\n\t\tQUI DONG 2 PHAN SO: \n";
	xuat1PS(quiDong2PS(a,b));
	xuat1PS(quiDong2PS(b,a));
	
	cout<<"\n\t\tSO SANH 2 PHAN SO: \n";
	xuatSS(a,b);
	
	cout<<"\n\t\tKIEM TRA AM DUONG: \n";
	xuatAmDuong(a);
	xuatAmDuong(b);
	
	return 0;
}

void xuatAmDuong(PHANSO a)
{
	cout<<"Phan so "<<a.tuso<<"/"<<a.mauso;
	if(ktAmDuong(a)==0)
		cout<<" =0\n";
	else
		if(ktAmDuong(a)==1)
			cout<<" DUONG (+)\n";
		else
			cout<<" AM (-)\n";
}

int ktAmDuong(PHANSO a)
{
	a=rutGon1PS(a);
	if(a.tuso==0)
		return 0;
	else
		if(a.tuso>0)
			return 1;
		else
			return 2;
}

int BCNN(int a, int b)
{
	return a*b/UCLN(a,b);
}

void xuatSS(PHANSO a, PHANSO b)
{
	cout<<a.tuso<<"/"<<a.mauso;
	if(soSanh2PS(a,b)==1)
		cout<<" > ";
	else
		if(soSanh2PS(a,b)==2)
			cout<<" < ";
		else
			cout<<" = ";
	
	cout<<b.tuso<<"/"<<b.mauso<<endl;
}

int soSanh2PS(PHANSO a, PHANSO b)
{
	PHANSO t1,t2;
	t1=quiDong2PS(a,b);
	t2=quiDong2PS(b,a);
	
	if(t1.tuso==t2.tuso)
		return 0;
	else
		if(t1.tuso>t2.tuso)
			return 1;
		else
			return 2;
}

PHANSO quiDong2PS(PHANSO a, PHANSO b)
{
	int k=BCNN(a.mauso,b.mauso)/a.mauso;
	PHANSO q;
	q.tuso= a.tuso*k;
	q.mauso= a.mauso*k;
	
	return xuLyDauTru(q);
}

void xuat1PS(PHANSO a)
{
	if(a.tuso==0)
			cout<<0<<endl;
	else
		cout<<a.tuso<<"/"<<a.mauso<<endl;
}

void nhapPS(PHANSO &a)
{
	cout<<"Nhap TU SO: ";
	cin>>a.tuso;
	cout<<"Nhap MAU SO: ";
	cin>>a.mauso;
	
	while(a.mauso==0)
	{
		cout<<"Vui long nhap lai MAU SO: ";
		cin>>a.mauso;
	}
}

PHANSO thuong2PS(PHANSO a, PHANSO b)
{
	PHANSO thuong;
	thuong.tuso= a.tuso*b.mauso;
	thuong.mauso= a.mauso*b.tuso;
	return rutGon1PS(thuong);
}

PHANSO tich2PS(PHANSO a, PHANSO b)
{
	PHANSO tich;
	tich.tuso= a.tuso*b.tuso;
	tich.mauso= a.mauso*b.mauso;
	return rutGon1PS(tich);
}

PHANSO hieu2PS(PHANSO a, PHANSO b)
{
	PHANSO hieu;
	hieu.tuso= a.tuso*b.mauso - b.tuso*a.mauso;
	hieu.mauso= a.mauso*b.mauso;
	return rutGon1PS(hieu);
}

PHANSO tong2PS(PHANSO a, PHANSO b)
{
	PHANSO tong;
	tong.tuso= a.tuso*b.mauso + b.tuso*a.mauso;
	tong.mauso= a.mauso*b.mauso;
	return rutGon1PS(tong);
}

PHANSO rutGon1PS(PHANSO a)
{
	PHANSO kq;
	if(a.tuso==0)
	{
		kq.tuso=0;
		kq.mauso=a.mauso;
	}
	else
	{
		int m=UCLN(a.tuso,a.mauso);
		kq.tuso= a.tuso/m;
		kq.mauso= a.mauso/m;
	}

	return xuLyDauTru(kq);
}

PHANSO xuLyDauTru(PHANSO a)
{
	PHANSO tam;
	tam.tuso=a.tuso;
	tam.mauso=a.mauso;
	
	if(a.tuso*a.mauso >0)
	{
		tam.tuso= abs(a.tuso);
		tam.mauso= abs(a.mauso);
	}
	else
		if(a.mauso<0)
		{
			tam.tuso= -a.tuso;
			tam.mauso= -a.mauso;
		}
		
	return tam;
}

int UCLN(int a, int b)
{
	a=abs(a);
	b=abs(b);
	
	if(a*b==0)
		return a+b;
	
	while(a != b)
		if(a>b)
			a -= b;
		else
			b -=a;
	return a;
}
