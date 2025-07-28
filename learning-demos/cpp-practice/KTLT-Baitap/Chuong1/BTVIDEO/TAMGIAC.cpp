#include<iostream>
#include<cmath>
using namespace std;

struct DIEM
{
	int x;
	int y;
};

struct TAMGIAC
{
	DIEM p[3];
};

void nhapTG(TAMGIAC &a);
void xuatTG(TAMGIAC a);
double chuViTG(TAMGIAC a);
double khoangCach2diem(DIEM a, DIEM b);
void xuat(double a);
double dienTichTG(TAMGIAC a);

int main()
{
	TAMGIAC a;
	nhapTG(a);
	xuatTG(a);
	
	cout<<"\nCHU VI TAM GIAC: ";
	xuat(chuViTG(a));
	
	cout<<"\nDIEN TICH TAM GIAC: ";
	xuat(dienTichTG(a));
	
	return 0;
}

double dienTichTG(TAMGIAC a)
{
	double s,p;
	p= chuViTG(a);
	s= sqrt(p*(p-khoangCach2diem(a.p[0],a.p[1]))
	*(p-khoangCach2diem(a.p[0],a.p[2]))
	*(p-khoangCach2diem(a.p[2],a.p[1])));
	return s;
}

double chuViTG(TAMGIAC a)
{
	double p=0;
	for(int i=0;i<3;i++)
		p += khoangCach2diem(a.p[i],a.p[(i+1) %3]);
	return p;
}

double khoangCach2diem(DIEM a, DIEM b)
{
	double kq;
	kq= sqrt(pow(a.x-b.x,2) +pow(a.y-b.y,2));
	return kq;
}

void xuat(double a)
{
	cout<<a<<endl;
}

void nhapTG(TAMGIAC &a)
{
	for(int i=0;i<3;i++)
		cin>>a.p[i].x>>a.p[i].y;
}

void xuatTG(TAMGIAC a)
{
	cout<<endl;
	for(int i=0;i<3;i++)
		cout<<"("<<a.p[i].x<<", "<<a.p[i].y<<")"<<endl;
}
