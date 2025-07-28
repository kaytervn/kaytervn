#include<iostream>
#include<cstring>
#define SIZE 100

void nTaiPos(char S[], int n, int p, char P[]);
void nKyTuDau(char S[], int n, char D[]);
void nKyTuCuoi(char S[], int n, char C[]);
void nhap(char a[], int &n, int &p);
void xuatChuoi(char S[]);

using namespace std;
int main()
{
	char S[SIZE], D[SIZE], C[SIZE], P[SIZE];
	int p,n;
	nhap(S,n,p);

	nKyTuDau(S,n,D);
	xuatChuoi(D);

	nKyTuCuoi(S,n,C);
	xuatChuoi(C);

	nTaiPos(S,n,p,P);
	xuatChuoi(P);
	return 0;
}

void nTaiPos(char S[], int n, int p, char P[])
{
	int len=strlen(S);
	int nP=0;
	if(n+p>len)
		n=len-p;
	
	for(int i=p;i<p+n;i++)
		P[nP++]=S[i];	
	P[nP]='\0';	
}

void nKyTuDau(char S[], int n, char D[])
{
	int len=strlen(S);
	if(n>len)
		n=len;
	
	strncpy(D,S,n);
	D[n]='\0';
}

void nKyTuCuoi(char S[], int n, char C[])
{
	int nC=0;
	int len=strlen(S);
	if(n>len)
		n=len;
	
	for(int i=len-1;i>len-(n+1);i--)
		C[nC++]=S[i];
		
	C[nC]='\0';
	strrev(C);
}

void nhap(char a[], int &n, int &p)
{
	gets(a);
	cin>>n>>p;
}

void xuatChuoi(char S[])
{
	puts(S);
}

