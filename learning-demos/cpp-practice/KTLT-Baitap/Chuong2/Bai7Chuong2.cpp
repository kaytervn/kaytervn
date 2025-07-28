#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

void nhap(char A[]);
void xuat(char A[]);
void xoa(char A[], int k);
void xoaKhoangTrangDauCuoi(char A[]);
void chuCaiDauInHoa(char S[]);
void xoaKhoangThuaGiua(char A[]);
void chuanHoaChuoi(char A[]);

int main()
{
	char A[SIZE];
	nhap(A);
	chuanHoaChuoi(A);
	xuat(A);
	return 0;
}

void nhap(char A[])
{
	gets(A);
}

void xuat(char A[])
{
	puts(A);
}

void xoa(char A[], int k)
{
	int n=strlen(A);
	for(int i=k+1;i<n;i++)
		A[i-1]=A[i];
	A[n-1]='\0';
}

void xoaKhoangTrangDauCuoi(char A[])
{
	int n=strlen(A);
	
	while(A[0]==' ')
		xoa(A,0);
		
	while(A[n-1]==' ')
		xoa(A,n-1);
}

void chuCaiDauInHoa(char S[])
{
	if(S[0]>='a' && S[0]<='z')
		S[0] -= 32;

	int n=strlen(S);
	for(int i=1;i<n;i++)
		if(S[i-1]==' ' && S[i]>='a' && S[i]<='z')
			S[i] -= 32;
}

void xoaKhoangThuaGiua(char A[])
{
	int n=strlen(A);
	int i = 0;
	while(i < n)
		if(A[i] == ' ' && A[i+1] == ' ')
			xoa(A,i);
		else
			i++;
}

void chuanHoaChuoi(char A[])
{
	int n=strlen(A);
	xoaKhoangTrangDauCuoi(A);
	xoaKhoangThuaGiua(A);
	chuCaiDauInHoa(A);
}
