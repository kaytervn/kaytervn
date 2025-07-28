#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

void nhap(int &n);
void doiHe(int n, char S[], int he);
void xuatChuoi(char S[]);


int main()
{
	int n;
	char H[SIZE], T[SIZE], S[SIZE] ;
	nhap(n);

	doiHe(n,H,2);
	xuatChuoi(H);

	doiHe(n,T,8);
	xuatChuoi(T);

	doiHe(n,S,16);
	xuatChuoi(S);
	return 0;
}

void nhap(int &n)
{
	cin>>n;
}

void doiHe(int n, char S[], int he) // he lan luot la 2, 8, 16
{
	char x[]={'0','1','2','3','4','5','6','7','8','9','A','B','C','D', 'E','F'};
	int i=0;
	while(n>0)
	{
		S[i]=x[n%he];
		n /= he;
		i++;
	}
	S[i]='\0'; // i cuoi cung
	strrev(S);
}

void xuatChuoi(char S[])
{
	puts(S);
}
