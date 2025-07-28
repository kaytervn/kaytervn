#include<iostream>
#include<cstring>
#define SIZE 1000

void nhap(char a[]);
void xuat(char s[]);
void xoaKhoangThuaGiua(char s[], int &n);
void xoaKhoangTrangDauCuoi(char s[], int &n);
void xoa(char s[], int &n, int k);

using namespace std;
int main()
{
	char s[SIZE];
	nhap(s);
	int n=strlen(s);
	xoaKhoangTrangDauCuoi(s,n);
	xoaKhoangThuaGiua(s,n);
	xuat(s);
	return 0;
}

void nhap(char a[])
{
	gets(a);
}

void xoaKhoangThuaGiua(char s[], int &n)
{
	int i = 0;
	while(i < n)
		if(s[i]==' ' && s[i+1]==' ')
			xoa(s,n,i);
		else
			i++;
}

void xoa(char s[], int &n, int k)
{
	for(int i=k; i<n; i++)
		s[i]=s[i+1];
	n--;
}

void xoaKhoangTrangDauCuoi(char s[], int &n)
{
	while(s[0]==' ')
		xoa(s,n,0);
		
	while(s[n-1]==' ')
		xoa(s,n,n-1);
}

void xuat(char s[])
{
	puts(s);
}
