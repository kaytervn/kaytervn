#include<iostream>
#include<cstring>
#define SIZE 100

void nhap(char a[], char b[]);
bool checkChuoiCon(char a[], char b[]);
void xuat(int d);

using namespace std;
int main()
{
	char a[SIZE], b[SIZE];
	nhap(a,b);
	bool kq=checkChuoiCon(a,b);
	xuat(kq);
	return 0;
}

void nhap(char a[], char b[])
{
	gets(a);
	gets(b);
}

bool checkChuoiCon(char a[], char b[])
{
	return strstr(b,a) != '\0';
}

void xuat(int d)
{
	if(d==1)
		cout<<"LA TAP CON";
	else
		cout<<"KHONG LA TAP CON";
}
