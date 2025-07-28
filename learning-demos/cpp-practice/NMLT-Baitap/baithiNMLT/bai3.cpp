#include<bits/stdc++.h>
#include<cstring>

using namespace std;


bool ktSNT(int n)
{
	if(n<2)
		return 0;
	for(int i=2; i<=sqrt(n); i++)
		if(n%i == 0)
			return 0;
	return 1;
}

void nhap(char S[])
{
	gets(S);
}

int tongSoTrongChuoi (char S[])
{
	int len= strlen(S);
	int i=0;
	int so=0;
	int m=0;
	int tong=0;
	while(i<=len)
	{
		if(S[i]>='0' && S[i]<='9')
			so = so*10 + (S[i]-'0'); // Chuyen ky tu thanh so
		else
		{
			if(ktSNT(so)==1)
				m=max(m,so);
			so=0;
		}
		i++;
	}
	return m;
}

int main()
{
	char S[1000];
	nhap(S);
	int kq=tongSoTrongChuoi(S);
	cout<<kq;
	return 0;
}
