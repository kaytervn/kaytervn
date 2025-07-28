#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

struct LINHKIEN
{
	char ten[SIZE], qc[SIZE], loai[SIZE];
	int dg1,dg2;
};

int tongLKa(int n, LINHKIEN a[]);
void checkLinhKien(int n, LINHKIEN a[]);
void hoanVi(LINHKIEN &a, LINHKIEN &b);
void loaiVaTenTangDan(int n, LINHKIEN a[]);
void xuatDS(int n, LINHKIEN a[]);
void xuat1(LINHKIEN a);
void nhapDS(int &n, LINHKIEN a[]);
void nhap1(LINHKIEN &a);

int main()
{
	LINHKIEN a[SIZE];
	int n;
	nhapDS(n,a);
	
	cout<<"\n\tDANH SACHH LINH KIEN TANG DAN THEO LOAI VA TEN: ";
	loaiVaTenTangDan(n,a);
	
	checkLinhKien(n,a);
	
	return 0;
}

int tongLKa(int n, LINHKIEN a[])
{
	int s=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].loai,"A")==0)
			s++;
	return s;
}

void checkLinhKien(int n, LINHKIEN a[])
{
	if(tongLKa(n,a) <10)
		cout<<"\nKhong du linh kien A!";
	else
		cout<<"\nDa du linh kien A!";
}

void hoanVi(LINHKIEN &a, LINHKIEN &b)
{
	LINHKIEN tmp=a;
	a=b;
	b=tmp;
}

void loaiVaTenTangDan(int n, LINHKIEN a[])
{
	LINHKIEN b[SIZE];
	
	int nB=0;
	for(int i=0;i<n;i++)
		b[nB++]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(stricmp(b[i].loai,b[j].loai)>0 
			|| stricmp(b[i].loai,b[j].loai)==0 && stricmp(b[i].ten,b[j].ten)>0)
				hoanVi(b[i],b[j]);
				
	xuatDS(nB,b);
}

void xuatDS(int n, LINHKIEN a[])
{
	for(int i=0;i<n;i++)
	{
		xuat1(a[i]);
		cout<<endl;
	}
}

void xuat1(LINHKIEN a)
{
	cout<<"\nTen linh kien: "<<a.ten
	<<"\nQuy cach: "<<a.qc
	<<"\nLoai: "<<a.loai
	<<"\nDon gia loai 1: "<<a.dg1
	<<"\nDon gia loai 2: "<<a.dg2;
}

void nhapDS(int &n, LINHKIEN a[])
{
	cout<<"Nhap so luong linh kien: ";
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		cout<<"\n\tNHAP THONG TIN LINH KIEN THU "<<i+1;
		nhap1(a[i]);
	}
}

void nhap1(LINHKIEN &a)
{
	fflush(stdin);
	cout<<"\nTen linh kien: ";
	gets(a.ten);
	fflush(stdin);
	cout<<"Quy cach: ";
	gets(a.qc);
	fflush(stdin);
	cout<<"Loai: ";
	gets(a.loai);
	fflush(stdin);
	cout<<"Don gia loai 1: ";
	cin>>a.dg1;
	fflush(stdin);
	cout<<"Don gia loai 2: ";
	cin>>a.dg2;
}
