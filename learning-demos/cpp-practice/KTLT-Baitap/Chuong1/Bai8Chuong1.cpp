#include<iostream>
#include<cmath>
using namespace std;

struct DIEM
{
	int x;
	int y;
};

void dxO(DIEM a);
void dxOy(DIEM a);
void dxOx(DIEM a);
void xuat(double a);
double khoangCach2diem(DIEM a, DIEM b);
void xuatDiem(DIEM a);
void nhapDiem(DIEM &a);
DIEM tong2Diem(DIEM a, DIEM b);
DIEM hieu2Diem(DIEM a, DIEM b);
DIEM tich2Diem(DIEM a, DIEM b);

int main()
{
	DIEM a,b;
	nhapDiem(a);
	nhapDiem(b);
	
	cout<<"Tong 2 diem: ";
	xuatDiem(tong2Diem(a,b));
	cout<<"\nHieu 2 diem: ";
	xuatDiem(hieu2Diem(a,b));
	cout<<"\nTich 2 diem: ";
	xuatDiem(tich2Diem(a,b));
	
	cout<<"\n\nKhoang cach giua 2 diem: ";
	xuat(khoangCach2diem(a,b));
	
	cout<<"\n\t\tDIEM DOI XUNG";
	cout<<"\nQUA GOC TOA DO O:\n";
	dxO(a);
	dxO(b);
	
	cout<<"\nQUA TRUC OX:\n";
	dxOx(a);
	dxOx(b);
	
	cout<<"\nQUA TRUC OY:\n";
	dxOy(a);
	dxOy(b);
	
	return 0;
}

DIEM tong2Diem(DIEM a, DIEM b)
{
	DIEM tong;
	tong.x= a.x +b.x;
	tong.y= a.y +b.y;
	return tong;
}

DIEM hieu2Diem(DIEM a, DIEM b)
{
	DIEM hieu;
	hieu.x= a.x -b.x;
	hieu.y= a.y -b.y;
	return hieu;
}

DIEM tich2Diem(DIEM a, DIEM b)
{
	DIEM tich;
	tich.x= a.x*b.x;
	tich.y= a.y*b.y;
	return tich;
}

void dxO(DIEM a)
{
	if(a.x==0 && a.y==0)
	{
		cout<<"Diem ";
		xuatDiem(a);
		cout<<" la goc toa do O!\n";
	}
	else
	{
		a.x=-a.x;
		a.y=-a.y;
		xuatDiem(a);
		cout<<endl;	
	}
}

void dxOy(DIEM a)
{
	if(a.y==0)
	{
		cout<<"Diem ";
		xuatDiem(a);
		cout<<" nam tren truc Oy!\n";
	}
	else
	{
		a.x=-a.x;
		xuatDiem(a);
		cout<<endl;
	}
}

void dxOx(DIEM a)
{
	if(a.x==0)
	{
		cout<<"Diem ";
		xuatDiem(a);
		cout<<" nam tren truc Ox!\n";
	}
	else
	{
		a.y=-a.y;
		xuatDiem(a);
		cout<<endl;
	}
}

void xuat(double a)
{
	cout<<a<<endl;
}

double khoangCach2diem(DIEM a, DIEM b)
{
	double kq;
	kq= sqrt(pow(a.x-b.x,2) +pow(a.y-b.y,2));
	return kq;
}

void xuatDiem(DIEM a)
{
	cout<<"("<<a.x<<", "<<a.y<<")";
}

void nhapDiem(DIEM &a)
{
	cin>>a.x>>a.y;
}
