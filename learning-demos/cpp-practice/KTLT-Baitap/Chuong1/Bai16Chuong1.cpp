#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

struct MAYTINH
{
	char loai[SIZE], noiSX[SIZE];
	int tg;
};

void timXuatXu(int n, MAYTINH a[], char t[]);
void timTG(int n, MAYTINH a[], int t);
void xuatDS(int n, MAYTINH a[]);
void xuat1(MAYTINH a);
void nhapDS(int &n, MAYTINH a[]);
void nhap1(MAYTINH &a);

int main()
{
	MAYTINH a[SIZE];
	int n;
	char s[]="MY";
	nhapDS(n,a);
	
	cout<<"\n\tMAY CO THOI GIAN BAO HANH LA 1 NAM: ";
	timTG(n,a,1);
	
	cout<<"\n\tMAY XUAT XU TU MY: ";
	timXuatXu(n,a,s);
	
	return 0;
}

void timXuatXu(int n, MAYTINH a[], char t[])
{
	MAYTINH b[SIZE];
	
	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].noiSX,t)==0)
		{
			b[nB++]=a[i];
			co=1;
		}
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong tim thay!\n";
}

void timTG(int n, MAYTINH a[], int t)
{
	MAYTINH b[SIZE];
	
	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(a[i].tg==t)
		{
			b[nB++]=a[i];
			co=1;
		}
	
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong co!\n";
}

void xuatDS(int n, MAYTINH a[])
{
	for(int i=0;i<n;i++)
	{
		xuat1(a[i]);
		cout<<endl;
	}
}

void xuat1(MAYTINH a)
{
	cout<<"\nLoai may: "<<a.loai
	<<"\nNoi san xuat: "<<a.noiSX
	<<"\nThoi gian bao hanh: "<<a.tg;
}

void nhapDS(int &n, MAYTINH a[])
{
	cout<<"Nhap so luong may tinh: ";
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		cout<<"\n\tNHAP THONG TIN MAY TINH THU "<<i+1;
		nhap1(a[i]);
	}
}

void nhap1(MAYTINH &a)
{
	fflush(stdin);
	cout<<"\nLoai may: ";
	gets(a.loai);
	fflush(stdin);
	cout<<"Noi san xuat: ";
	gets(a.noiSX);
	fflush(stdin);
	cout<<"Thoi gian bao hanh (nam): ";
	cin>>a.tg;
}
