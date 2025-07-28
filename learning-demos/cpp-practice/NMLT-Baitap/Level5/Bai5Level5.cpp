#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n);
bool kiemTraSoHoanHao(int n);
int lietKeSoHoanHao(int n);
int main ()
{
	int n;
	nhap(n);
	lietKeSoHoanHao(n);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
bool kiemTraSoHoanHao(int n)
{
	int s=0;
	for(int i=1; i<= n/2; i++)
	{
		if (n%i == 0)
			s+= i;
	}
	if (s==n)
		return 1;
	else
		return 0;
}
int lietKeSoHoanHao(int n)
{
	for(int i=2; i<n; i++)
	{
		if(kiemTraSoHoanHao(i)==1)
			cout<<i<<" ";
	}
}

