#include<iostream>
#define SIZE 100
#include<cstring>
using namespace std;

void nhap(char A[]);
void tich2soLon(char A[], char B[], char C[]);
void xuat(char A[]);
void xuLyTich(char A[], char B[], char C[]);
void xoaDauTru(char A[]);
void xoa(char S[], int vt);
void xuLySo0(char A[]);
void themDauTru(char A[]);

int main()
{
	char A[SIZE],B[SIZE],C[SIZE*2];
	nhap(A);
	nhap(B);
	xuLyTich(A,B,C);
	xuat(C);
	
	return 0;
}

void nhap(char A[])
{
	gets(A);
}

void xuLyTich(char A[], char B[], char C[])
{
	if(A[0]=='-' && B[0]=='-')
	{
		xoaDauTru(A);
		xoaDauTru(B);
		tich2soLon(A,B,C);
	}
	else
		if(A[0]=='-' && B[0]!='-')
		{
			xoaDauTru(A);
			tich2soLon(A,B,C);
			themDauTru(C);
		}
		else
			if(A[0]!='-' && B[0]=='-')
			{
				xoaDauTru(B);
				tich2soLon(A,B,C);
				themDauTru(C);
			}
			else
				tich2soLon(A,B,C);
}

void tich2soLon(char A[], char B[], char C[])
{
	strrev(A);
	strrev(B);
	int lenA=strlen(A);
	int lenB=strlen(B);
	
	for(int i=0;i<lenA+lenB;i++)
		C[i]='0';
	
	for(int iB=0;iB<lenB;iB++)
	{
		int nho=0;
		int iA;
		for(iA=0;iA<lenA;iA++)
		{
			int x= (B[iB]-'0')*(A[iA]-'0') + nho + (C[iA+iB]-'0');
			C[iA+iB]=x%10 +'0';
			nho=x/10;
		}
		if(nho>0)
			C[iA+iB]=nho + '0';
	}
	
	if(C[lenA+lenB-1]!='0')
		C[lenA+lenB]='\0';
	else
		C[lenA+lenB-1]='\0';
	strrev(C);
	xuLySo0(C);
}

void xoaDauTru(char A[])
{
	strrev(A);
	int l=strlen(A);
	A[l-1]='\0';
	strrev(A);
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
	int i=0;
	while(A[i]=='0')
	{
		if(strlen(A)==1)
			break;
		xoa(A,i);
	}
}

void themDauTru(char A[])
{
	strrev(A);
	int l=strlen(A);
	A[l]='-';
	A[l+1]='\0';
	strrev(A);
}

void xuat(char A[])
{
	cout<<A;
}
