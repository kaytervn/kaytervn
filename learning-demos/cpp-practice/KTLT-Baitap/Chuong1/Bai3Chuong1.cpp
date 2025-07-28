#include<iostream>
#include<cmath>
using namespace std;

struct THOIGIAN
{
	unsigned int gio;
	unsigned int phut;
	unsigned int giay;
};

void xuatTG(THOIGIAN a);
void nhapTG(THOIGIAN &a);
THOIGIAN khoangCachTG(THOIGIAN a, THOIGIAN b);

int main()
{
	THOIGIAN a, b, kc;
	cout<<"\t\tNHAP THOI GIAN I: \n";
	nhapTG(a);
	cout<<"\nTHOI GIAN I: \n";
	xuatTG(a);
	
	cout<<"\n\t\tNHAP THOI GIAN II: \n";
	nhapTG(b);
	cout<<"\nTHOI GIAN II: \n";
	xuatTG(b);
	
	kc= khoangCachTG(a,b);
	cout<<"\n\t\tKHOANG CACH GIUA 2 MOC THOI GIAN: \n";
	xuatTG(kc);
	
	return 0;
}

THOIGIAN khoangCachTG(THOIGIAN a, THOIGIAN b)
{
	THOIGIAN time;
	int t1,t2,kc;
	t1= a.gio*3600 +a.phut*60 +a.giay;
	t2= b.gio*3600 +b.phut*60 +b.giay;
	kc=abs(t1-t2);
	
	time.phut= kc/60;
	time.giay= kc%60;
	time.gio= time.phut/60;
	time.phut= time.phut%60;
	
	return time;
}

void xuatTG(THOIGIAN a)
{
	cout<<"hh:mm:ss= "<<a.gio<<":"<<a.phut<<":"<<a.giay<<endl;
}

void nhapTG(THOIGIAN &a)
{
	int h,m,s;
	cout<<"Nhap GIO: ";
	cin>>h;
	while(h<0 || h>23)
	{
		cout<<"Vui long nhap lai GIO: ";
		cin>>h;
	}
	
	cout<<"Nhap PHUT: ";
	cin>>m;
	while(m<1 || m>59)
	{
		cout<<"Vui long nhap lai PHUT: ";
		cin>>m;
	}
	
	cout<<"Nhap GIAY: ";
	cin>>s;
	while(s<1 || s>59)
	{
		cout<<"Vui long nhap lai GIAY: ";
		cin>>s;
	}
	
	a.gio=h;
	a.phut=m;
	a.giay=s;
}
