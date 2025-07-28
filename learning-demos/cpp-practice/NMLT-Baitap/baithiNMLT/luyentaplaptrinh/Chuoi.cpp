#include<iostream>
#include<cstring>
using namespace std;

void nhap(char S[]);
void xuat(char S[]);
void xuatKiTuHoa(char S[]);
char tuDaiNhat(char s[]);
void xoaKhoangTrangDauCuoi(string &s, int &n);
void xoaKhoangThuaGiua(string &s, int &n);
void chuanHoaChuoi(string &s, int &n);
void xoa(string &s, int &n, int k);

int main()
{
	char S[100];
	nhap(S);
	xuat(S);
	return 0;
}

void nhap(char S[])
{
	gets(S);	
}

void xuatKiTuHoa(char S[])
{
	int n=strlen(S);
	for(int i=0;i<n;i++)
		if(S[i]>= 'A' && S[i]<= 'Z')
			cout<<S[i]<<endl;
}

char tuDaiNhat(char s[])
{
	int i;
	int maxx=0, maxi=0;
	int len=strlen(s);
	
	if(s[0]==' ') 
	{
	    for(i=0; i<len-1; i++) 
		{
	        if((s[i]==' ') && (s[i+1]!=' ')) 
			{
	            int j=i+1;
				int dem=0;
				while((s[j]!=' ') && (s[j]!='\0')) 
				{
					dem++;
					j++;
				}
				if(dem>maxx) 
				{
					maxx=dem;
					maxi=i+1;
				}
				i=j-1;
			}
	
	    }
	}
	else 
	{
		i=0;
		int dem=0;
		while((s[i]!=' ') && (s[i]!='\0'))
		{
			dem++;
			i++;
		}
		if(dem>maxx)
		{
			maxx=dem;
			maxi=0;
		}
		for(i=maxx-1; i<len-1; i++)
		{
			if((s[i]==' ') && (s[i+1]!=' ')) 
			{
				int j=i+1;
				int de=0;
				while((s[j]!=' ') && (s[j]!='\0'))
				{
					de++;
					j++;
				}
				if(de>maxx)
				{
					maxx=de;
					maxi=i+1;
				}
				i=j-1;
			}
		}
	}
	int k;
	for(k=maxi; k<(maxi+maxx); k++)
		cout<<s[k];
}

void xoaKhoangTrangDauCuoi(string &s, int &n)
{
	while(s[0] == ' ')
		xoa(s,n,0);
		
	while(s[n-1] == ' ')
		xoa(s,n,n-1);
}

void xoaKhoangThuaGiua(string &s, int &n)
{
	int i = 0;
	while(i < n)
		if(s[i] == ' ' && s[i+1] == ' ')
			xoa(s,n,i);
		else
			i++;
}

void chuanHoaChuoi(string &s, int &n)
{
	xoaKhoangTrangDauCuoi(s,n);
	xoaKhoangThuaGiua(s,n);
}

void xoa(string &s, int &n, int k)
{
	for(int i = k; i < n; i++)
		s[i] = s[i+1];
	n--;
}

void xuat(char S[])
{
	char T[100];
	char D[100];
	strcpy(T,S);
	strcpy(D,S);
	string str(S);
	int n=str.size();
	
	puts(S);
	cout<<strrev(S)<<endl;
	xuatKiTuHoa(T);
	tuDaiNhat(D);
	cout<<endl;
	
	chuanHoaChuoi(str,n);
	cout<<str;
}
