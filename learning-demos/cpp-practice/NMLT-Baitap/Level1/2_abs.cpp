#include<iostream>
#include<cmath>
void nhap(int &n);
int triTuyetDoi(int n);
void xuat(int ttd);
using namespace std;
int main()
{
	int n;
	nhap(n);
	int ttd =triTuyetDoi(n);
	xuat (ttd);
	return 0;
}
void nhap(int &n)
{
	cout<<"Nhap n: "; cin>>n;
}
int triTuyetDoi(int n)
{
	int k= abs(n);
	return k;
}
void xuat(int ttd)
{
	cout<<"Gia tri tuyet doi cua n: "<<ttd;
}
