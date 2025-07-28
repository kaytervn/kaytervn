#include<iostream>
#include<cmath>
using namespace std;

struct DIEM
{
	int x;
	int y;
};

void xuatDiem(DIEM a);
void nhapDiem(DIEM &a);
void xuat(double a);
double khoangCach2diem(DIEM a, DIEM b);
void ktPhanTu(DIEM a);
void dxO(DIEM a);
void dxOy(DIEM a);
void dxOx(DIEM a);

int main()
{
	DIEM a,b;
	nhapDiem(a);
	nhapDiem(b);
	
	cout<<endl;
	xuatDiem(a);
	cout<<endl;
	xuatDiem(b);
	cout<<endl;
	
	cout<<"\t\tKHOANG CACH GIUA 2 DIEM: \n";
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
	
	cout<<"\n\t\tDIEM THUOC GOC PHAN TU\n";
	ktPhanTu(a);
	ktPhanTu(b);
	
	return 0;
}

void ktPhanTu(DIEM a)
{
	if(a.x==0 || a.y==0)
		cout<<"Diem khong nam o goc phan tu nao!\n";
	else
		if(a.x>0 || a.y>0)
		{	
			cout<<"Diem ";
			xuatDiem(a);
			cout<<" nam o goc PHAN TU thu I!\n";
		}
		else
			if(a.x<0 || a.y>0)
			{	
				cout<<"Diem ";
				xuatDiem(a);
				cout<<" nam o goc PHAN TU thu II!\n";
			}
			else
				if(a.x<0 || a.y<0)
				{	
					cout<<"Diem ";
					xuatDiem(a);
					cout<<" nam o goc PHAN TU thu III!\n";
				}
				else
				{	
					cout<<"Diem ";
					xuatDiem(a);
					cout<<" nam o goc PHAN TU thu VI!\n";
				}
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
