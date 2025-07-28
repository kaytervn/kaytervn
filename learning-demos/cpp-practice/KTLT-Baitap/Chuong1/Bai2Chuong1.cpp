#include<iostream>
#include<cmath>
using namespace std;

struct PHANSO
{
	int tuso;
	int mauso;
};

void xuatDS(int n, PHANSO a[]);
void xuat1PS(PHANSO a);
void nhap1PS(PHANSO &a);
void nhapDS(int &n, PHANSO a[]);
void xuatDSnghichDao(int n, PHANSO tam);
PHANSO psMax(int n, PHANSO a[]);
PHANSO tichDS(int n, PHANSO a[]);
PHANSO thuongDS(int n, PHANSO a[]);
PHANSO tongDS(int n, PHANSO a[]);
PHANSO hieuDS(int n, PHANSO a[]);
void nghichDaoDS(int n, PHANSO a[]);
PHANSO nghichDao1PS(PHANSO a);
PHANSO thuong2PS(PHANSO a, PHANSO b);
PHANSO tich2PS(PHANSO a, PHANSO b);
PHANSO hieu2PS(PHANSO a, PHANSO b);
PHANSO tong2PS(PHANSO a, PHANSO b);
int UCLN(int a, int b);
PHANSO xuLyDauTru(PHANSO a);
PHANSO rutGon1PS(PHANSO a);
int soSanh2PS(PHANSO a, PHANSO b);
void quiDong2PS(PHANSO &a, PHANSO &b);
int BCNN(int a, int b);

int main()
{
	PHANSO a[50];
	int n;
	nhapDS(n,a);
	
	cout<<"\n\t\tDANH SACH PHAN SO: \n";
	xuatDS(n,a);
	
	PHANSO max=psMax(n,a);
	cout<<"\nPhan so lon nhat: ";
	xuat1PS(max);
	
	PHANSO tong=tongDS(n,a);
	cout<<"\nTONG MANG PHAN SO: ";
	xuat1PS(tong);
	
	PHANSO hieu=hieuDS(n,a);
	cout<<"\nHIEU MANG PHAN SO: ";
	xuat1PS(hieu);
	
	PHANSO tich=tichDS(n,a);
	cout<<"\nTICH MANG PHAN SO: ";
	xuat1PS(tich);
	
	PHANSO thuong=thuongDS(n,a);
	cout<<"\nTHUONG MANG PHAN SO: ";
	xuat1PS(thuong);
	
	cout<<"\n\t\tXUAT MANG NGHICH DAO: \n";
	nghichDaoDS(n,a);
	return 0;
}

void nghichDaoDS(int n, PHANSO a[])
{
	PHANSO tam[50];
	int nTam=0;
	int dem=0;
	
	for(int i=0;i<n;i++)
		if(a[i].tuso!=0)
		{	
			tam[nTam++]=nghichDao1PS(a[i]);
			dem++;
		}
	
	if(dem==0)
		cout<<"Khong co phan so HOP LE!";
	else
		for(int i=0;i<nTam;i++)
			xuat1PS(tam[i]);
}

PHANSO psMax(int n, PHANSO a[])
{
	PHANSO max=a[0];
	int vt=0;
	
	for(int i=1;i<n;i++)
		if(soSanh2PS(a[i],max)>0)
		{
			max=a[i];
			vt=i;
		}
	
	return rutGon1PS(a[vt]);
}

int BCNN(int a, int b)
{
	return a*b/UCLN(a,b);
}

int soSanh2PS(PHANSO a, PHANSO b)
{
	quiDong2PS(a,b);
	
	if(a.tuso==b.tuso)
		return 0;
	else
		if(a.tuso>b.tuso)
			return 1;
		else
			return -1;
}

void quiDong2PS(PHANSO &a, PHANSO &b)
{
	a=xuLyDauTru(a);
	b=xuLyDauTru(b);
	
	int k1=BCNN(a.mauso,b.mauso)/a.mauso;
	int k2=BCNN(a.mauso,b.mauso)/b.mauso;
	
	a.tuso= a.tuso*k1;
	a.mauso= a.mauso*k1;
	
	b.tuso= b.tuso*k2;
	b.mauso= b.mauso*k2;
}

PHANSO tichDS(int n, PHANSO a[])
{
	PHANSO s;
	s.tuso=a[0].tuso;
	s.mauso=a[0].mauso;
	
	for(int i=1;i<n;i++)
		s =tich2PS(s,a[i]);
		
	return rutGon1PS(s);
}

PHANSO thuongDS(int n, PHANSO a[])
{
	PHANSO s;
	s.tuso=a[0].tuso;
	s.mauso=a[0].mauso;
	
	for(int i=1;i<n;i++)
		s =thuong2PS(s,a[i]);
		
	return rutGon1PS(s);
}

PHANSO tongDS(int n, PHANSO a[])
{
	PHANSO s;
	s.tuso=a[0].tuso;
	s.mauso=a[0].mauso;
	
	for(int i=1;i<n;i++)
		s =tong2PS(s,a[i]);
		
	return rutGon1PS(s);
}

PHANSO hieuDS(int n, PHANSO a[])
{
	PHANSO s;
	s.tuso=a[0].tuso;
	s.mauso=a[0].mauso;
	
	for(int i=1;i<n;i++)
		s =hieu2PS(s,a[i]);
		
	return rutGon1PS(s);
}

PHANSO nghichDao1PS(PHANSO a)
{
	int tam=a.tuso;
	a.tuso=a.mauso;
	a.mauso=tam;
	return rutGon1PS(a);
}

PHANSO thuong2PS(PHANSO a, PHANSO b)
{
	PHANSO thuong;
	
	if(b.tuso==0)
	{
		rutGon1PS(a);
		return a;
	}
	else
	{
		thuong.tuso= a.tuso*b.mauso;
		thuong.mauso= a.mauso*b.tuso;
		return rutGon1PS(thuong);
	}
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
	return hieu;
}

PHANSO tong2PS(PHANSO a, PHANSO b)
{
	PHANSO tong;
	tong.tuso= a.tuso*b.mauso + b.tuso*a.mauso;
	tong.mauso= a.mauso*b.mauso;
	return tong;
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

void xuatDS(int n, PHANSO a[])
{
	for(int i=0;i<n;i++)
	{
		rutGon1PS(a[i]);
		xuat1PS(a[i]);
	}
}

void xuat1PS(PHANSO a)
{
	if(a.tuso==0)
			cout<<0<<endl;
	else
		cout<<a.tuso<<"/"<<a.mauso<<endl;
}

void nhap1PS(PHANSO &a)
{
	cout<<"Nhap tu so: ";
	cin>>a.tuso;
	cout<<"Nhap mau so: ";
	cin>>a.mauso;
	
	while(a.mauso==0)
	{
		cout<<"Vui long nhap lai mau so: ";
		cin>>a.mauso;
	}

}

void nhapDS(int &n, PHANSO a[])
{
	cout<<"Nhap so luong phan so: ";
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		cout<<"\n\t\tNHAP PHAN SO THU "<<i+1<<endl;
		nhap1PS(a[i]);
	}
}
