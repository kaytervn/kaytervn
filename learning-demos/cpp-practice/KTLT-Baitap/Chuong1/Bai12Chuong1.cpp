#include<iostream>
#include<cmath>
using namespace std;

struct PHANSO
{
	int tuso;
	int mauso;
};

void hoanVi(PHANSO &a, PHANSO &b);
void mangTangDan(int n, PHANSO a[], PHANSO b[]);
PHANSO psMin(int n, PHANSO a[]);
PHANSO psMax(int n, PHANSO a[]);
int soSanh2PS(PHANSO a, PHANSO b);
int BCNN(int a, int b);
void quiDong2PS(PHANSO &a, PHANSO &b);
PHANSO tongDS(int n, PHANSO a[]);
PHANSO tong2PS(PHANSO a, PHANSO b);
PHANSO rutGon1PS(PHANSO a);
PHANSO xuLyDauTru(PHANSO a);
int UCLN(int a, int b);
void xuatDS(int n, PHANSO a[]);
void xuat1PS(PHANSO a);
void nhap1PS(PHANSO &a);
void nhapDS(int &n, PHANSO a[]);
void xuatDSrutGon(int n, PHANSO a[]);

int main()
{
	PHANSO a[50],max,min,b[50],c[50];
	int n;
	nhapDS(n,a);
	
	PHANSO tong=tongDS(n,a);
	cout<<"\nTONG MANG PHAN SO: ";
	xuat1PS(tong);
	
	max=psMax(n,a);
	cout<<"\nPhan so lon nhat: ";
	xuat1PS(max);
	
	min=psMin(n,a);
	cout<<"\nPhan so nho nhat: ";
	xuat1PS(min);
	
	mangTangDan(n,a,b);
	cout<<"\nMang tang dan: \n";
	xuatDSrutGon(n,b);
	
	return 0;
}

void xuatDSrutGon(int n, PHANSO a[])
{
	for(int i=0;i<n;i++)
		xuat1PS(rutGon1PS(a[i]));
}

void hoanVi(PHANSO &a, PHANSO &b)
{
	PHANSO tmp=a;
	a=b;
	b=tmp;
}

void mangTangDan(int n, PHANSO a[], PHANSO b[])
{
	for(int i=0;i<n;i++)
		b[i]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(soSanh2PS(b[i],b[j])>0)
				hoanVi(b[i],b[j]);
}

PHANSO psMin(int n, PHANSO a[])
{
	PHANSO min=a[0];
	int vt=0;
	
	for(int i=1;i<n;i++)
		if(soSanh2PS(a[i],min)<0)
		{
			min=a[i];
			vt=i;
		}
	
	return rutGon1PS(a[vt]);
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

PHANSO tongDS(int n, PHANSO a[])
{
	PHANSO s;
	s.tuso=a[0].tuso;
	s.mauso=a[0].mauso;
	
	for(int i=1;i<n;i++)
		s =tong2PS(s,a[i]);
		
	return rutGon1PS(s);
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
		xuat1PS(rutGon1PS(a[i]));
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
