#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

struct SACH
{
	char MSS[SIZE],ten[SIZE],aut[SIZE];
	int sl;
};

void nhapDS(int &n, SACH a[]);
void nhap1(SACH &a);
void nhapKyTu(char a[]);
void xuat(int a);
int tongSach(int n, SACH a[]);
void timTen(int n, SACH a[], char t[]);
void xuatDS(int n, SACH a[]);
void xuat1(SACH a);

int main()
{
	int n;
	char ten[SIZE];
	SACH a[SIZE];
	nhapDS(n,a);
	
	cout<<"\nNHAP TEN SACH CAN TIM: ";
	nhapKyTu(ten);
	timTen(n,a,ten);
	
	cout<<"\nTONG SO SACH TRONG THU VIEN: ";
	xuat(tongSach(n,a));
	
	return 0;
}

void nhapKyTu(char a[])
{
	fflush(stdin);
	gets(a);
}

void xuat(int a)
{
	cout<<a;
}

int tongSach(int n, SACH a[])
{
	int s=0;
	for(int i=0;i<n;i++)
		s +=a[i].sl;
	return s;
}

void timTen(int n, SACH a[], char t[])
{
	SACH b[SIZE];
	
	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].ten,t)==0)
		{
			b[nB++]=a[i];
			co=1;
		}
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong tim thay!\n";
}

void xuatDS(int n, SACH a[])
{
	for(int i=0;i<n;i++)
	{
		xuat1(a[i]);
		cout<<endl;
	}
}

void xuat1(SACH a)
{
	cout<<"\nMa so sach: "<<a.MSS
	<<"\nTen sach: "<<a.ten
	<<"\nTac gia: "<<a.aut
	<<"\nSo luong: "<<a.sl;
}

void nhapDS(int &n, SACH a[])
{
	cout<<"Nhap so luong dau sach: ";
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		cout<<"\n\tNHAP THONG TIN DAU SACH THU "<<i+1;
		nhap1(a[i]);
	}
}

void nhap1(SACH &a)
{
	fflush(stdin);
	cout<<"\nMa so sach: ";
	gets(a.MSS);
	fflush(stdin);
	cout<<"Ten sach: ";
	gets(a.ten);
	fflush(stdin);
	cout<<"Tac gia: ";
	gets(a.aut);
	fflush(stdin);
	cout<<"So luong sach: ";
	cin>>a.sl;
}
