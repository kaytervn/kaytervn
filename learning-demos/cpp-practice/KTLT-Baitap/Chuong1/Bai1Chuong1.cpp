#include<iostream>
using namespace std;

struct DATE
{
	unsigned int ngay;
	unsigned int thang;
	unsigned int nam;
};

struct HOCSINH
{
	char MSHS[6];
	char hoten[31];
	DATE ngaysinh;
	char diachi[51];
	char phai[4];
	float diemtb;
};

void nhapN(int &n);
void xuat1HS(HOCSINH a);
void xuatDS(int n, HOCSINH a[]);
void nhapttHS(HOCSINH &a);
void nhapDS(int &n, HOCSINH a[]);
void duocLenLop(int n, HOCSINH a[]);

int main()
{
	HOCSINH a[50];
	int n;
	nhapN(n);
	nhapDS(n,a);
	cout<<"\n\t\tDANH SACH HOC SINH: \n";
	xuatDS(n,a);
	cout<<"\n\t\tHOC SINH DUOC LEN LOP: \n";
	duocLenLop(n,a);
	return 0;
}

void duocLenLop(int n, HOCSINH a[])
{
	for(int i=0;i<n;i++)
		if(a[i].diemtb >= 5.0)
			xuat1HS(a[i]);
}

void xuat1HS(HOCSINH a)
{
	cout<<"\nMSHS: "<<a.MSHS;
	cout<<"\nHo va ten: "<<a.hoten;
	cout<<"\nNgay thang nam sinh: "<<a.ngaysinh.ngay<<"/"<<a.ngaysinh.thang<<"/"<<a.ngaysinh.nam;
	cout<<"\nDia chi: "<<a.diachi;
	cout<<"\nGioi tinh: "<<a.phai;
	cout<<"\nDiem trung binh: "<<a.diemtb<<endl;
}

void xuatDS(int n, HOCSINH a[])
{
	for(int i=0;i<n;i++)
		xuat1HS(a[i]);
}

void nhapttHS(HOCSINH &a)
{
	cout<<"\nMSHS: ";
	fflush(stdin);
	gets(a.MSHS);
	cout<<"Nhap ho va ten: ";
	gets(a.hoten);
	cout<<"Nhap ngay thang nam sinh: ";
	cin>>a.ngaysinh.ngay>>a.ngaysinh.thang>>a.ngaysinh.nam;
	cout<<"Nhap dia chi: ";
	fflush(stdin);
	gets(a.diachi);
	cout<<"Nhap gioi tinh: ";
	gets(a.phai);
	cout<<"Nhap diem trung binh: ";
	cin>>a.diemtb;
}

void nhapN(int &n)
{
	cout<<"Nhap SO LUONG hoc sinh: ";
	cin>>n;
}

void nhapDS(int &n, HOCSINH a[])
{
	for(int i=0;i<n;i++)
	{
		cout<<"\n\t\tNHAP THONG TIN HOC SINH THU "<<i+1<<endl;
		nhapttHS(a[i]);
	}
}
