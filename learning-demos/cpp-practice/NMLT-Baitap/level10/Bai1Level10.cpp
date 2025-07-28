#include<iostream>
#include<cmath>
#include<cstring>
using namespace std;

void nhap(char s[]);
void xuat(int s);
int doiHe16Sang10(char s[]);

int main()
{
	char s[200];
	nhap(s);	
	int kq=doiHe16Sang10(s);
	xuat(kq);
	return 0;
}

void nhap(char s[])
{
	gets(s);
	//fgets(s,200,stdin);
}

void xuat(int s)
{
	cout<<s;
}

int doiHe16Sang10(char s[])
{
	int n=strlen(s);
	int h;
	int d=0;
	
	// Tu tren xuong
	for (int i=0; i<n; i++)
	{
		if (s[i] >= 'A' && s[i] <= 'Z')
			h = s[i] - 55;
		else 
			if (s[i] >= 'a' && s[i] <= 'z')
				h = s[i] - 32 - 55;
		else
			h = s[i] - 48;
		int u=n-i-1;
		d += h*pow(16, u);
	}
	
//	// Tu duoi len
//	for (int i=n-1; i>=0; i--)
//	{
//		if (s[i] >= 'A' && s[i] <= 'Z')
//			h = s[i] - 55;
//		else 
//			if (s[i] >= 'a' && s[i] <= 'z')
//				h = s[i] - 32 - 55;
//		else
//			h = s[i] - 48;
//		int u=n-i-1;
//		d += h*pow(16, u);
//	}
	
	return d;
}
