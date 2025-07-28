#include<iostream>
#include<cmath>
using namespace std;

struct HINHTRU
{
	float bk,h;
};

void xuat(float a);
float theTichHT(HINHTRU a);
float dtTP(HINHTRU a);
float dtDay(HINHTRU a);
void nhapHT(HINHTRU &a);
float dtXQ(HINHTRU a);

int main()
{
	HINHTRU a;
	nhapHT(a);
	cout<<"DIEN TICH XUNG QUANH: ";
	xuat(dtXQ(a));
	cout<<"DIEN TICH TOAN PHAN: ";
	xuat(dtTP(a));
	cout<<"THE TICH: ";
	xuat(theTichHT(a));
	
	return 0;
}

void xuat(float a)
{
	cout<<a<<endl;
}

float theTichHT(HINHTRU a)
{
	float s;
	s= dtDay(a)*a.h;
	return s;
}

float dtTP(HINHTRU a)
{
	float s;
	s= dtXQ(a) +2*dtDay(a);
	return s;
}

float dtDay(HINHTRU a)
{
	float s;
	s= 3.14*a.bk*a.bk;
	return s;
}

float dtXQ(HINHTRU a)
{
	float s;
	s= 2*3.14*a.bk*a.h;
	return s;
}

void nhapHT(HINHTRU &a)
{
	cin>>a.bk>>a.h;
}
