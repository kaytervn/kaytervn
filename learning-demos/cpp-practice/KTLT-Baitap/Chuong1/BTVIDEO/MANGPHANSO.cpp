#include<iostream>
#include<cmath>
using namespace std;

struct PHANSO
{
	int tuso;
	int mauso;
};

PHANSO psMax(int n, PHANSO a[]);
PHANSO rutGon1PS(PHANSO a);
PHANSO xuLyDauTru(PHANSO a);
int UCLN(int a, int b);
void xuatDS(int n, PHANSO a[]);
void xuat1PS(PHANSO a);
void nhapDS(int &n, PHANSO a[]);
PHANSO psMin(int n, PHANSO a[]);
void xuatDSrutGon(int n, PHANSO a[]);
int soSanh2PS(PHANSO a, PHANSO b);
int BCNN(int a, int b);
PHANSO quiDong2PS(PHANSO a, PHANSO b);
int demPSam(int n, PHANSO a[]);
int demPSduong(int n, PHANSO a[]);
void xuat(int a);
PHANSO psDuongDauTien(int n, PHANSO a[]);
void mangTangDan(int n, PHANSO a[], PHANSO b[]);
void hoanVi(PHANSO &a, PHANSO &b);
void mangGiamDan(int n, PHANSO a[], PHANSO b[]);

int main()
{
	PHANSO a[50],max,min,b[50],c[50];
	int n;
	nhapDS(n,a);
	
	cout<<"\n\t\tDANH SACH PHAN SO: \n";
	xuatDS(n,a);
	
	cout<<"\nRut gon moi phan so: \n";
	xuatDSrutGon(n,a);
	
	cout<<"\nSo luong phan so am: ";
	xuat(demPSam(n,a));
	
	cout<<"\nSo luong phan so duong: ";
	xuat(demPSduong(n,a));
	
	cout<<"\nPhan so duong dau tien: ";
	xuat1PS(psDuongDauTien(n,a));
	
	max=psMax(n,a);
	cout<<"\nPhan so lon nhat: ";
	xuat1PS(max);
	
	min=psMin(n,a);
	cout<<"\nPhan so nho nhat: ";
	xuat1PS(min);
	
	mangTangDan(n,a,b);
	cout<<"\nMang tang dan: \n";
	xuatDSrutGon(n,b);
	
	mangGiamDan(n,a,c);
	cout<<"\nMang giam dan: \n";
	xuatDSrutGon(n,c);
	
	return 0;
}

void hoanVi(PHANSO &a, PHANSO &b)
{
	PHANSO tmp=a;
	a=b;
	b=tmp;
}

void mangGiamDan(int n, PHANSO a[], PHANSO b[])
{
	for(int i=0;i<n;i++)
		b[i]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(soSanh2PS(b[i],b[j])==2)
				hoanVi(b[i],b[j]);
}

void mangTangDan(int n, PHANSO a[], PHANSO b[])
{
	for(int i=0;i<n;i++)
		b[i]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(soSanh2PS(b[i],b[j])==1)
				hoanVi(b[i],b[j]);
}

PHANSO psDuongDauTien(int n, PHANSO a[])
{
	for(int i=0;i<n;i++)
	{
		if(xuLyDauTru(a[i]).tuso>0)
			return xuLyDauTru(a[i]);
	}
}

void xuat(int a)
{
	cout<<a<<endl;
}

int demPSam(int n, PHANSO a[])
{
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(xuLyDauTru(a[i]).tuso<0)
			dem++;
	}
	
	return dem;
}

int demPSduong(int n, PHANSO a[])
{
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(xuLyDauTru(a[i]).tuso>0)
			dem++;
	}
	
	return dem;
}

void xuatDSrutGon(int n, PHANSO a[])
{
	for(int i=0;i<n;i++)
		xuat1PS(rutGon1PS(a[i]));
}

PHANSO psMin(int n, PHANSO a[])
{
	PHANSO min=a[0];
	for(int i=1;i<n;i++)
		if(soSanh2PS(a[i],min)==2)
			min=a[i];

	return rutGon1PS(min);
}

PHANSO psMax(int n, PHANSO a[])
{
	PHANSO max=a[0];
	for(int i=1;i<n;i++)
		if(soSanh2PS(a[i],max)==1)
			max=a[i];

	return rutGon1PS(max);
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

int BCNN(int a, int b)
{
	return a*b/UCLN(a,b);
}

PHANSO quiDong2PS(PHANSO a, PHANSO b)
{
	int k=BCNN(a.mauso,b.mauso)/a.mauso;
	PHANSO q;
	q.tuso= a.tuso*k;
	q.mauso= a.mauso*k;
	
	return xuLyDauTru(q);
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
		xuat1PS(a[i]);
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
