#include<iostream>
#include<cstring>
void nhap(char S[]);
void xoaNguyenAm(char S[]);
void xoa(char S[], int vt);
void xuat(char S[]);
using namespace std;
int main()
{
	char S[2000];
	nhap(S);
	xoaNguyenAm(S);
	xuat(S);
	return 0;
}

void nhap(char S[])
{
	gets(S);
}

void xoaNguyenAm(char S[])
{
	int n= strlen(S);
	for(int i=0;i<n;i++)
		if(S[i]=='A'||S[i]=='E'||S[i]=='I'||S[i]=='O'||S[i]=='U')
		{
			xoa(S,i);
			i--;
		}
}

void xoa(char S[], int vt)
{
	int n=strlen(S);
	for(int i=vt+1;i<n;i++)
		S[i-1]=S[i];
	S[n-1]='\0';
}

void xuat(char S[])
{
	cout<<S;
}
