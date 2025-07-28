#include<iostream>
#include<cstring>
#include<cmath>
#define SIZE 100
using namespace std;

void themSo0(char A[], int vtD, int vtC);
void tong2soLon(char A[], char B[], char S[]);
void xuat(char A[]);
void nhap(char A[]);
void themSo0(char A[], int k);
void chuanHoa(char A[], char B[]);
void hieulonTruNho(char A[], char B[], char S[]);
void tinhHieu(char A[], char B[], char S[]);
void xuLySo0(char A[]);
void xuLyHieu(char A[], char B[], char S[]);
void xoaDauTru(char A[]);
void xuLyTong(char A[], char B[], char S[]);
void themDauTru(char A[]);
void xoa(char S[], int vt);

int main()
{
	char A[SIZE],B[SIZE],S[SIZE*2];
	nhap(A);
	nhap(B);
	xuLyTong(A,B,S);
	xuat(S);
	
	return 0;
}

void nhap(char A[])
{
	gets(A);
}

void xoaDauTru(char A[])
{
	strrev(A);
	int l=strlen(A);
	A[l-1]='\0';
	strrev(A);
}

void xuLyHieu(char A[], char B[], char S[])
{
	if(A[0]=='-'&&B[0]=='-')
	{
		xoaDauTru(A);
		xoaDauTru(B);
		tinhHieu(B,A,S);
	}
	else
		if(A[0]=='-'&&B[0]!='-')
		{
			xoaDauTru(A);
			tong2soLon(A,B,S);
			themDauTru(S);
		}
		else
			if(A[0]!='-'&&B[0]=='-')
			{
				xoaDauTru(B);
				tong2soLon(A,B,S);
			}
			else
				tinhHieu(A,B,S);
}

void xuLyTong(char A[], char B[], char S[])
{
	if(A[0]=='-'&&B[0]=='-')
	{
		xoaDauTru(A);
		xoaDauTru(B);
		tong2soLon(A,B,S);
		themDauTru(S);
	}
	else
		if(A[0]=='-'&&B[0]!='-')
		{
			xoaDauTru(A);
			tinhHieu(B,A,S);
		}
		else
			if(A[0]!='-'&&B[0]=='-')
			{
				xoaDauTru(B);
				tinhHieu(A,B,S);
			}
			else
				tong2soLon(A,B,S);
}

void themSo0(char A[], int k)
{
	int l=strlen(A);
	for(int i=l;i<l+k;i++)
		A[i]='0';
	A[l+k]='\0';
}

void chuanHoa(char A[], char B[])
{
	int l1=strlen(A);
	int l2=strlen(B);
	int k= abs(l1-l2);
	if(l1>l2)
		themSo0(B,k);
	else
		themSo0(A,k);
}

void xoa(char S[], int vt)
{
	int n=strlen(S);
	for(int i=vt+1;i<n;i++)
		S[i-1]=S[i];
	S[n-1]='\0';
}

void xuLySo0(char A[])
{
	strrev(A);
	int l=strlen(A);
	int i=l-1;
	while(A[i]=='0')
	{
		if(i==0)
			break;
		xoa(A,i);
	}
	strrev(A);
}

void themDauTru(char A[])
{
	strrev(A);
	int l=strlen(A);
	A[l]='-';
	A[l+1]='\0';
	strrev(A);
}

void tinhHieu(char A[], char B[], char S[])
{
	int l1,l2;
	l1=strlen(A);
	l2=strlen(B);
	if(l1>l2)
		hieulonTruNho(A,B,S);
	else
		if(l1<l2)
		{
			hieulonTruNho(B,A,S);
			themDauTru(S);
		}
		else
			if(strcmp(A,B)>=0)
				hieulonTruNho(A,B,S);
			else
			{
				hieulonTruNho(B,A,S);
				themDauTru(S);
			}
	xuLySo0(S);
}

void hieulonTruNho(char A[], char B[], char S[])
{
	int n,t,nho;
	strrev(A);
	strrev(B);
	chuanHoa(A,B);
	nho=0;
	n=strlen(A);
	
	for(int i=0;i<n;i++)
	{
		t=(A[i]-'0') -(B[i]-'0') -nho;
		if(t<0)
		{
			S[i]=t+10 +'0';
			nho=1;
		}
		else
		{
			S[i]=t +'0';
			nho=0;
		}
	}
	
	S[n]='\0';
	strrev(S);	
}

void tong2soLon(char A[], char B[], char S[])
{
	int n,t,nho;
	strrev(A);
	strrev(B);
	chuanHoa(A,B);
	nho=0;
	n=strlen(A);
	
	for(int i=0;i<n;i++)
	{
		t=(A[i]-'0') +(B[i]-'0') +nho;
		S[i]=t%10 +'0';
		nho=t/10;
	}
	
	if(nho==1)
		S[n++]='1';
	S[n]='\0';
	strrev(S);	
}

void xuat(char A[])
{
	puts(A);
}
