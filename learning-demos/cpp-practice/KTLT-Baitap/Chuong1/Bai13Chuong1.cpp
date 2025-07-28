#include<iostream>
#include<cstring>
using namespace std;

struct SINHVIEN
{
	char MSV[10];
	char ten[60];
	int namsinh;
	float toan, ly, hoa, dtb;
};

void nhap1SV(SINHVIEN &a);
void nhapDS(int &n, SINHVIEN a[]);
void xuat1SV(SINHVIEN a);
void xuatDS(int n, SINHVIEN a[]);
void dtbMaxDS(int n, SINHVIEN a[]);
float dtbMax(int n, SINHVIEN a[]);
void hoanVi(SINHVIEN &a, SINHVIEN &b);
void dtbTangDan(int n, SINHVIEN a[]);
void toanGiamDan(int n, SINHVIEN a[]);
void dtbLon5khongDuoi3(int n, SINHVIEN a[]);
void tuoiMaxDS(int n, SINHVIEN a[]);
int tuoiMax(int n, SINHVIEN a[]);
void nhapKyTu(char a[]);
void timTTSV(int n, SINHVIEN a[], char ten[]);

int main()
{
	SINHVIEN a[50];
	int n;
	char ten[60];
	nhapDS(n,a);

	cout<<"\n\tDANH SACH SINH VIEN";
	xuatDS(n,a);
	
	cout<<"\n\tSINH VIEN CO DTB CAO NHAT";
	dtbMaxDS(n,a);
	
	cout<<"\n\tDANH SACH SINH VIEN CO DTB TANG DAN";
	dtbTangDan(n,a);
	
	cout<<"\n\tDANH SACH SINH VIEN CO DIEM TOAN GIAM DAN";
	toanGiamDan(n,a);

	cout<<"\n\tDANH SACH SINH VIEN CO DTB >5.0 VA KHONG CO MON DUOI 3.0";
	dtbLon5khongDuoi3(n,a);
	
	cout<<"\n\tSINH VIEN CO TUOI LON NHAT";
	tuoiMaxDS(n,a);
	
	cout<<"\nNHAP TEN SV CAN TIM: ";
	nhapKyTu(ten);
	timTTSV(n,a,ten);
		
	return 0;
}

void nhapKyTu(char a[])
{
	fflush(stdin);
	gets(a);
}

void timTTSV(int n, SINHVIEN a[], char ten[])
{
	SINHVIEN b[50];

	int nB,co;
	co=0;
	nB=0;
	
	for(int i=0;i<n;i++)
		if(stricmp(a[i].ten,ten)==0)
		{
			b[nB++]=a[i];
			co=1;
		}
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong co sinh vien hop le!\n";
}

void tuoiMaxDS(int n, SINHVIEN a[])
{
	for(int i=0;i<n;i++)
		if(a[i].namsinh==tuoiMax(n,a))
		{
			xuat1SV(a[i]);
			cout<<endl;
		}
}

int tuoiMax(int n, SINHVIEN a[])
{
	int max=a[0].namsinh;
	for(int i=0;i<n;i++)
		if(a[i].namsinh<max)
			max=a[i].namsinh;
	return max;
}

void dtbLon5khongDuoi3(int n, SINHVIEN a[])
{
	SINHVIEN b[50];
	int co,nB;
	co=0;
	nB=0;
	for(int i=0;i<n;i++)
		if(a[i].dtb>5.0 
			&& a[i].toan >=3.0 
			&& a[i].ly >=3.0 
			&& a[i].hoa >=3.0)
		{
			b[nB++]=a[i];
			co=1;
		}
	if(co==1)
		xuatDS(nB,b);
	else
		cout<<"\nKhong co sinh vien hop le!\n";
}

void hoanVi(SINHVIEN &a, SINHVIEN &b)
{
	SINHVIEN tmp=a;
	a=b;
	b=tmp;
}

void toanGiamDan(int n, SINHVIEN a[])
{
	SINHVIEN b[50];
	int nB=0;
	for(int i=0;i<n;i++)
		b[nB++]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(b[i].toan<b[j].toan)
				hoanVi(b[i],b[j]);
				
	xuatDS(nB,b);
}

void dtbTangDan(int n, SINHVIEN a[])
{
	SINHVIEN b[50];
	int nB=0;
	for(int i=0;i<n;i++)
		b[nB++]=a[i];
	
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(b[i].dtb>b[j].dtb)
				hoanVi(b[i],b[j]);

	xuatDS(nB,b);
}

void dtbMaxDS(int n, SINHVIEN a[])
{
	for(int i=0;i<n;i++)
		if(a[i].dtb==dtbMax(n,a))
		{
			xuat1SV(a[i]);
			cout<<endl;
		}
}

float dtbMax(int n, SINHVIEN a[])
{
	float max=a[0].dtb;
	
	for(int i=0;i<n;i++)
		if(a[i].dtb>max)
			max=a[i].dtb;
	
	return max;
}

void xuatDS(int n, SINHVIEN a[])
{
	for(int i=0;i<n;i++)
	{
		xuat1SV(a[i]);
		cout<<endl;
	}
}

void xuat1SV(SINHVIEN a)
{
	cout<<"\nMSV: "<<a.MSV
	<<"\nHo va ten: "<<a.ten
	<<"\nNam sinh: "<<a.namsinh
	<<"\nDiem toan: "<<a.toan
	<<"\nDiem ly: "<<a.ly
	<<"\nDiem hoa: "<<a.hoa
	<<"\nDiem trung binh: "<<a.dtb;
}

void nhapDS(int &n, SINHVIEN a[])
{
	cout<<"Nhap so luong sinh vien: ";
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		cout<<"\n\tNHAP THONG TIN SINH VIEN THU "<<i+1;
		nhap1SV(a[i]);
	}
}

void nhap1SV(SINHVIEN &a)
{
	fflush(stdin);
	cout<<"\nMSV: ";
	cin>>a.MSV;
	fflush(stdin);
	cout<<"Ho va ten: ";
	gets(a.ten);
	fflush(stdin);
	cout<<"Nam sinh: ";
	cin>>a.namsinh;
	fflush(stdin);
	cout<<"Diem toan: ";
	cin>>a.toan;
	fflush(stdin);
	cout<<"Diem ly: ";
	cin>>a.ly;
	fflush(stdin);
	cout<<"Diem hoa: ";
	cin>>a.hoa;
	
	a.dtb= (a.toan +a.ly +a.hoa) /3;
}
