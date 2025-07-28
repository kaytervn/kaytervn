#include<bits/stdc++.h>
using namespace std;

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
	S[i]='\0';
	//strrev(S);
}

int doiHe2SangHe10(char S[])
{
	int s=0;
	for (int i=0;i<strlen(S);i++)
		s+=pow(2,i)*(S[i]-'0');
	return s;
}

int main()
{
	int n,A[1000],B[100],m=0;
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
		
	char s[100];
	for(int i=0;i<n;i++)
	{
		doiHe(A[i],s,2);

		for(int j=0;j<strlen(s);j++)
			if(j%2==0)
				s[j]='1';
		
		m=max(m,doiHe2SangHe10(s));
	}
	cout<<m;
	
}
