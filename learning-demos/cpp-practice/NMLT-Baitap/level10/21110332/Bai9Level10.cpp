#include<iostream>
#include<cstring>
#define SIZE 100

void nhap(char a[]);
void chuCaiDauInHoa(char S[]);
void xuat(char S[]);

using namespace std;
int main()
{
	char s[SIZE];
	nhap(s);
	chuCaiDauInHoa(s);
	xuat(s);
	return 0;
}

void nhap(char a[])
{
	gets(a);
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

void xuat(char S[])
{
	puts(S);
}
