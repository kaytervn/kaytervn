//Sau khi da chuan hoa
#include<iostream>
#include<cstring>
#define SIZE 100

void tuDaiNhat(char S[], char T[]);
void nhap(char S[]);
void xuat(char kq[]);

using namespace std;

int main ()
{
	char S[SIZE],T[SIZE];
	nhap(S);
	tuDaiNhat(S,T);
	xuat(T);
	return 0;
}

void tuDaiNhat(char S[], char T[])
{
	int n=strlen(S);
	int maxi=0;

	int i=0;
	int dem=0;

	// Dem tu dau tien la MAX
	while(S[i]!=' ' && S[i] !='\0')
	{
		dem++;
		i++;
	}
	int maxx=dem;

	i=maxx;
	while(i<n-1)
	{
		if(S[i]==' ' && S[i+1]!= ' ')
		{
			int j=i+1;
			int dem2=0;
			while(S[j]!=' ' && S[j] !='\0')
			{
				dem2++;
				j++;
			}
			if(dem2>maxx)
			{
				maxx=dem2;
				maxi=i+1;
			}
			i=j-1;
		}
		i++;
	}
	
	int nT=0;
	for(int k=maxi;k<=(maxi+maxx);k++)
		T[nT++]=S[k];
	T[nT]='\0';
}

void nhap(char S[])
{
	gets(S);
}

void xuat(char kq[])
{
	puts(kq);
}

