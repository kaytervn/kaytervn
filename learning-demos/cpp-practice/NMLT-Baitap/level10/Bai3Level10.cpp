#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

void nhap(char S[]);
void xuatChuoiDaoNguoc(char S[]);

int main()
{
	char S[SIZE];
	nhap(S);
	strrev(S);
	xuatChuoiDaoNguoc(S);
	return 0;
}

void nhap(char S[])
{
	gets(S);
}

void xuatChuoiDaoNguoc(char S[])
{
	puts(S);
}
