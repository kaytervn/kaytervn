#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n);
void calc(int n, int &s, int &dem);
int tinhK(int n);
void xuat(int s, int dem, int k);
int main ()
{
	int n,s,dem;
	nhap(n);
	int k=tinhK(n);
	calc(n,s,dem);
	xuat (s,dem,k);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}

int tinhK(int n)
{
	int k=-1;
	int i=0;
	while(i<n)
	{
		if(pow(2,i)<=n)
			k=i;
		i++;
	}
	return k;
}

void calc(int n, int &s, int &dem)
{
	s=0;
	dem=0;
	int i=0;
	for(int tmp; n>0; n = n/10)
	{
		tmp = n%10;
		s +=tmp;
		dem++;
	}
	if(dem==0)
		dem=1;
}
void xuat(int s, int dem, int k)
{
	cout<<dem<<endl<<s<<endl<<k;
}
