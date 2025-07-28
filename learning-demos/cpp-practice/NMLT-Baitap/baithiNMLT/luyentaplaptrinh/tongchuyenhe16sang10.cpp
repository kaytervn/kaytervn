#include<bits/stdc++.h>
using namespace std;

int doiHe16Sang10(char s[])
{
	int n=strlen(s);
	int h;
	int d=0;
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
	return d;
}

int main()
{
	char a[1000],b[1000];
	gets(a);
	gets(b);
	int nA=doiHe16Sang10(a);
	int nB=doiHe16Sang10(b);
	int s=nA+nB;
	cout<<s;
}
