#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

void nhap(int &n);
void doiHe(int n, char S[], int he);
void xuat(char A[]);
void doiHeTu1denN(int n, char s[]);

int main()
{
	int n;
	char A[SIZE];
	nhap(n);
	doiHeTu1denN(n,A);
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

void doiHeTu1denN(int n, char s[])
{
	char A[SIZE];
	for(int i=1;i<=n;i++)
	{
		doiHe(i,A,2);
		xuat(A);
	}
}

void doiHe(int n, char S[], int he)
{
	char x[]={'0','1','2','3','4','5','6','7','8','9','A','B','C','D', 'E','F'};
	int i=0;
	while(n>0)
	{
		S[i]=x[n%he];
		n /= he;
		i++;
	}
	S[i]='\0';
	strrev(S);
}

void xuat(char A[])
{
	puts(A);
}
