#include<iostream>
using namespace std;
void xuat(int tien);
void nhap(char S[], int &n);
int tinhSoTien(char S[], int n);
int main()
{
	char S[10000];
	int n;
	nhap(S,n);
	int tien = tinhSoTien(S,n);
	xuat(tien);
	return 0;
}
int tinhSoTien(char S[], int n)
{
	int i = 0;
	int tong = 0;
	int so = 0;
	while(i <= n)
	{
		if(S[i] >= '0' && S[i] <= '9')
			so = so*10 +S[i] - '0';
		else
		{
			tong = tong + so;
			so = 0;
		}
		i++;
	}
	return tong;
}
void nhap(char S[], int &n)
{
	cin>>n;
	for(int i = 0; i < n; i++)
		cin>>S[i];
	S[n] = '\0';
}
void xuat(int tien)
{
	cout<<tien;
}
