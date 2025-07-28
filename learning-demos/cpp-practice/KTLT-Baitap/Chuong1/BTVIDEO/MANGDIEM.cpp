#include<iostream>
#include<cmath>
#define SIZE 100
using namespace std;

struct DIEM
{
	int x;
	int y;
};

void nhapNdiem(int &n, DIEM a[]);
void xuatNdiem(int n, DIEM a[]);
void xuat(int a);
int demXduong(int n, DIEM a[]);
int demSLdiem0trung(int n, DIEM a[]);
void xuatNhungDiemXmax(int n, DIEM a[]);
int xMax(int n, DIEM a[]);
void xuatDiem(DIEM a);
void diemGanO(int n, DIEM a[]);
void nhapDiem(DIEM &a);

int main()
{
	int n,xDuong,trung;
	DIEM a[SIZE];
	nhapNdiem(n,a);
	xuatNdiem(n,a);
	
	xDuong=demXduong(n,a);
	cout<<"\nSo luong diem co hoanh do duong: ";
	xuat(xDuong);
	
	trung=demSLdiem0trung(n,a);
	cout<<"\n\nSo luong diem khong trung: ";
	xuat(trung);
	
	cout<<"\n\nNhung diem co hoanh do lon nhat: \n";
	xuatNhungDiemXmax(n,a);
	
	cout<<"\nNhung diem gan goc toa do nhat: \n";
	diemGanO(n,a);
	return 0;
}

void diemGanO(int n, DIEM a[])
{
	float min,tmp;
	min= sqrt(a[0].x*a[0].x + a[0].y*a[0].y);
	for(int i=1;i<n;i++)
	{
		tmp= sqrt(a[i].x*a[i].x + a[i].y*a[i].y);
		if(tmp<min)
			min=tmp;
	}
	
	for(int i=0;i<n;i++)
	{
		tmp= sqrt(a[i].x*a[i].x + a[i].y*a[i].y);
		if(tmp==min)
			xuatDiem(a[i]);
	}
}

void xuatNhungDiemXmax(int n, DIEM a[])
{
	for(int i=0;i<n;i++)
	{
		if(a[i].x==xMax(n,a))
			xuatDiem(a[i]);
	}
}

int xMax(int n, DIEM a[])
{
	int max=a[0].x;
	for(int i=1;i<n;i++)
	{
		if(a[i].x > max)
			max=a[i].x;
	}
	return max;
}

int demSLdiem0trung(int n, DIEM a[])
{
	int dem=0,co;
	for(int i=0;i<n;i++)
	{
		co=0;
		for(int j=0;j<n;j++)
		{
			if(i==j)
				continue;
			else	
				if(a[i].x == a[j].x && a[i].y == a[j].y)
					co=1;
		}
		if(co==0)
			dem++;
	}
	return dem;
}

void xuat(int a)
{
	cout<<a;
}

int demXduong(int n, DIEM a[])
{
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(a[i].x>0)
			dem++;
	}
	return dem;
}

void xuatDiem(DIEM a)
{
	cout<<"("<<a.x<<", "<<a.y<<")"<<endl;
}

void xuatNdiem(int n, DIEM a[])
{
	for(int i=0;i<n;i++)
	{
		cout<<"("<<a[i].x<<", "<<a[i].y<<")"<<endl;
	}
}

void nhapDiem(DIEM &a)
{
	cin>>a.x>>a.y;
}

void nhapNdiem(int &n, DIEM a[])
{
	cin>>n;
	
	for(int i=0;i<n;i++)
	{
		nhapDiem(a[i]);
	}
}
