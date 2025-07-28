#include<iostream>
#define SIZE 100
#include<cstring>
using namespace std;

struct VIDEO
{
	char ten[SIZE],
		tl[SIZE],
		dir[SIZE],
		nam[SIZE],
		nu[SIZE],
		hang[SIZE];
	int namSX;
};

void xuatDS(int n, VIDEO a[]);
void xuat1(VIDEO a);
void nhapKyTu(char a[]);
void timTheLoai(int n, VIDEO a[], char t[]);
void nhapDS(int &n, VIDEO a[]);
void nhap1(VIDEO &a);
void timNamChinh(int n, VIDEO a[], char t[]);
void timDaoDien(int n, VIDEO a[], char t[]);

int main()
{
	VIDEO a[SIZE];
	char t[SIZE],nam[SIZE],d[SIZE];
	int n;
	nhapDS(n,a);
	
	cout<<"\nNHAP THE LOAI CAN TIM: ";
	nhapKyTu(t);
	timTheLoai(n,a,t);
		
	cout<<"\nNHAP TEN NAM DIEN VIEN CAN TIM: ";
	nhapKyTu(nam);
	timNamChinh(n,a,nam);
	
	cout<<"\nNHAP TEN DAO DIEN CAN TIM: ";
	nhapKyTu(d);
	timDaoDien(n,a,d);
		
	return 0;
}

void timDaoDien(int n, VIDEO a[], char t[])
{
	VIDEO b[SIZE];
	
	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].dir,t)==0)
		{
			b[nB++]=a[i];
			co=1;
		}
	
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong tim thay!\n";
}

void timNamChinh(int n, VIDEO a[], char t[])
{
	VIDEO b[SIZE];
	
	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].nam,t)==0)
		{
			b[nB++]=a[i];
			co=1;
		}
	
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong tim thay!\n";
}

void xuatDS(int n, VIDEO a[])
{
	for(int i=0;i<n;i++)
	{
		xuat1(a[i]);
		cout<<endl;
	}
}

void xuat1(VIDEO a)
{
	cout<<"\nTen phim: "<<a.ten
	<<"\nThe loai: "<<a.tl
	<<"\nDao dien: "<<a.dir
	<<"\nNam chinh: "<<a.nam
	<<"\nNu chinh: "<<a.nu
	<<"\nNam san xuat: "<<a.namSX
	<<"\nHang san xuat: "<<a.hang;
}

void nhapKyTu(char a[])
{
	fflush(stdin);
	gets(a);
}

void timTheLoai(int n, VIDEO a[], char t[])
{
	VIDEO b[SIZE];
	
	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].tl,t)==0)
		{
			b[nB++]=a[i];
			co=1;
		}
	
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong tim thay!\n";
}

void nhapDS(int &n, VIDEO a[])
{
	cout<<"Nhap so luong phim: ";
	cin>>n;
	for(int i=0;i<n;i++)
	{
		cout<<"\n\tNHAP THONG TIN PHIM THU "<<i+1;
		nhap1(a[i]);
	}
}

void nhap1(VIDEO &a)
{
	fflush(stdin);
	cout<<"\nTen phim: ";
	gets(a.ten);
	fflush(stdin);
	cout<<"The loai: ";
	gets(a.tl);
	fflush(stdin);
	cout<<"Dao dien: ";
	gets(a.dir);
	fflush(stdin);
	cout<<"Nam chinh: ";
	gets(a.nam);
	fflush(stdin);
	cout<<"Nu chinh: ";
	gets(a.nu);
	fflush(stdin);
	cout<<"Nam san xuat: ";
	cin>>a.namSX;
	fflush(stdin);
	cout<<"Hang san xuat: ";
	gets(a.hang);
}
