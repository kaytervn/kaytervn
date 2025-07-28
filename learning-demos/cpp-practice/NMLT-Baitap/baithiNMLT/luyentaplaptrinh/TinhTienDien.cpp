#include<iostream>
void nhap(int &a);
int tienDien(int a);
void xuat(int d);

using namespace std;
int main()
{
	int a;
	nhap(a);
	int kq=tienDien(a);
	xuat(kq);
	return 0;
}

void nhap(int &a)
{
	cin>>a;
}

int tienDien(int a)
{
	int t;
	if(a<=48)
		t=a*600;
	else
		if(a>48 && a<=48*2)
			t=48*600+(a-48)*1004;
	else
		if(a>48*2 && a<=48*3)
			t=48*(600+1004)+(a-96)*1214;
	else
		t=48*(600+1004+1214)+(a-144)*1594;
	return t;
}

void xuat(int d)
{
	cout<<d;
}
