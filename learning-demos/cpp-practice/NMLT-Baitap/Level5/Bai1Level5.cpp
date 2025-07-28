#include<iostream>
#include<cmath>
using namespace std;
void nhap(int &n);
int kiemTraSoNguyenTo(int n);
int lietKeSoNguyenTo(int n);
int main ()
{
	int n;
	nhap(n);
	lietKeSoNguyenTo(n);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraSoNguyenTo(int n)
{
	for(int i=2; i<=sqrt(n); i++)
	{
		if (n%i == 0)
			return 0;
	}
}
int lietKeSoNguyenTo(int n)
{
	for(int i=2; i<n; i++)
	{
		if(kiemTraSoNguyenTo(i)!=0)
			cout<<i<<" ";
	}
}
