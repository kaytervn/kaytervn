#include<iostream>
#include<cstring>
void nhap(char S[]);
int tongSoTrongChuoi (char S[]);
void xuat(int d);
using namespace std;
int main()
{
	char S[1000];
	nhap(S);
	int kq=tongSoTrongChuoi(S);
	xuat(kq);
	return 0;
}

void nhap(char S[])
{
	gets(S);
}

int tongSoTrongChuoi (char S[])
{
	int len= strlen(S);
	int i=0;
	int so=0;
	int tong=0;
	while(i<=len)
	{
		if(S[i]>='0' && S[i]<='9')
			so = so*10 + (S[i]-'0'); // Chuyen ky tu thanh so
		else
		{
			tong += so;
			so=0;
		}
		i++;
	}
	return tong;
}

void xuat(int d)
{
	cout<<d;
}
