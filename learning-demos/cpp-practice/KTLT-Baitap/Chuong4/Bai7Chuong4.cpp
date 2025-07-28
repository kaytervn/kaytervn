#include<iostream>
#include<cstring>
#define SIZE 10000
using namespace std;

int tongSoTrongChuoi(char A[]);
void nhap(char A[]);
void xuat(int n);

int main()
{
	char A[SIZE];
	nhap(A);
	int kq=tongSoTrongChuoi(A);
	xuat(kq);
	return 0;
}

int tongSoTrongChuoi(char A[])
{
	int n=strlen(A);
	int s=0;
	int num=0;
	for(int i=0;i<=n;i++)
		if(A[i]>='0'&&A[i]<='9')
			num=num*10+(A[i]-'0');
		else
		{
			s+=num;
			num=0;
		}
	return s;	
}

void nhap(char A[])
{
	gets(A);
}

void xuat(int n)
{
	cout<<n;
}
