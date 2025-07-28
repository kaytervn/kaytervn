#include<iostream>
#include<cstring>
void nhap(char S[]);
int tongSoTrongChuoi (char S[]);
void xuat(int d);
void nhap(char S[], int &n);
using namespace std;
int main()
{
	char S[1000];
	int n;
	nhap(S,n);
	int kq=tongSoTrongChuoi(S);
	xuat(kq);
	return 0;
}

void nhap(char S[], int &n)
{
	cin>>n;
	for(int i = 0; i < n; i++)
		cin>>S[i];
    S[n] = '\0';
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
