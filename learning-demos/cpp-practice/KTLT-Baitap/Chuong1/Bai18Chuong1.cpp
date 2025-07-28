#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

struct HANG
{
	char ma[SIZE],ten[SIZE];
	int sl,dg,ton,bh;
};

void hoanVi(HANG &a, HANG &b);
void tonTangDan(int n, HANG a[]);
void baoHanh(int n, HANG a[], int t);
void giaMaxDS(int n, HANG a[]);
int giaMax(int n, HANG a[]);
void tonMinDS(int n, HANG a[]);
int tonMin(int n, HANG a[]);
void tonMaxDS(int n, HANG a[]);
int tonMax(int n, HANG a[]);
void xuatDS(int n, HANG a[]);
void xuat1(HANG a);
void nhap1(HANG &a);
void nhapDS(int &n, HANG a[]);

int main()
{
	HANG a[SIZE];
	int n;
	nhapDS(n,a);
	
	cout<<"\n\tMAT HANG CO SO LUONG TON NHIEU NHAT: ";
	tonMaxDS(n,a);
	
	cout<<"\n\tMAT HANG CO SO LUONG TON IT NHAT: ";
	tonMinDS(n,a);
	
	cout<<"\n\tMAT HANG CO GIA TIEN CAO NHAT: ";
	giaMaxDS(n,a);
	
	cout<<"\n\tNHUNG MAT HANG CO THOI GIAN BAO HANH >12 THANG: ";
	baoHanh(n,a,12);
	
	cout<<"\n\tSAP XEP TANG DAN THEO SO LUONG TON: ";
	tonTangDan(n,a);
	
	return 0;
}

void hoanVi(HANG &a, HANG &b)
{
	HANG tmp=a;
	a=b;
	b=tmp;
}

void tonTangDan(int n, HANG a[])
{
	HANG b[SIZE];
	int nB=0;
	for(int i=0;i<n;i++)
		b[nB++]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(b[i].ton>b[j].ton)
				hoanVi(b[i],b[j]);
				
	xuatDS(nB,b);
}

void baoHanh(int n, HANG a[], int t)
{
	for(int i=0;i<n;i++)
		if(a[i].bh>t)
		{
			xuat1(a[i]);
			cout<<endl;
		}
}

void giaMaxDS(int n, HANG a[])
{
	for(int i=0;i<n;i++)
		if(a[i].dg==giaMax(n,a))
		{
			xuat1(a[i]);
			cout<<endl;
		}
}

int giaMax(int n, HANG a[])
{
	int max=a[0].dg;
	for(int i=0;i<n;i++)
		if(a[i].dg>max)
			max=a[i].dg;
	return max;
}

void tonMinDS(int n, HANG a[])
{
	for(int i=0;i<n;i++)
		if(a[i].ton==tonMin(n,a))
		{
			xuat1(a[i]);
			cout<<endl;
		}
}

int tonMin(int n, HANG a[])
{
	int min=a[0].ton;
	for(int i=0;i<n;i++)
		if(a[i].ton<min)
			min=a[i].ton;
	return min;
}

void tonMaxDS(int n, HANG a[])
{
	for(int i=0;i<n;i++)
		if(a[i].ton==tonMax(n,a))
		{
			xuat1(a[i]);
			cout<<endl;
		}
}

int tonMax(int n, HANG a[])
{
	int max=a[0].ton;
	for(int i=0;i<n;i++)
		if(a[i].ton>max)
			max=a[i].ton;
	return max;
}

void xuatDS(int n, HANG a[])
{
	for(int i=0;i<n;i++)
	{
		xuat1(a[i]);
		cout<<endl;
	}
}

void xuat1(HANG a)
{
	cout<<"\nMa hang: "<<a.ma
	<<"\nTen mat hang: "<<a.ten
	<<"\nSo luong: "<<a.sl
	<<"\nDon gia: "<<a.dg
	<<"\nSo luong ton: "<<a.ton
	<<"\nThoi gian bao hanh (thang): "<<a.bh;
}

void nhapDS(int &n, HANG a[])
{
	cout<<"Nhap so luong mat hang: ";
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		cout<<"\n\tNHAP THONG TIN MAT HANG THU "<<i+1;
		nhap1(a[i]);
	}
}

void nhap1(HANG &a)
{
	fflush(stdin);
	cout<<"\nMa hang: ";
	gets(a.ma);
	fflush(stdin);
	cout<<"Ten mat hang: ";
	gets(a.ten);
	fflush(stdin);
	cout<<"So luong: ";
	cin>>a.sl;
	fflush(stdin);
	cout<<"Don gia: ";
	cin>>a.dg;
	fflush(stdin);
	cout<<"So luong ton: ";
	cin>>a.ton;
	fflush(stdin);
	cout<<"Thoi gian bao hanh (thang): ";
	cin>>a.bh;
}
