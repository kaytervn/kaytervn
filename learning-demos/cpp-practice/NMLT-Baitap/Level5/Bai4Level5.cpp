#include<iostream>
using namespace std;
void nhap(int &n);
int kiemTraSoChinhPhuong(int n);
int lietKeSoChinhPhuong(int n);
int main ()
{
	int n;
	nhap(n);
	lietKeSoChinhPhuong(n);
	return 0;
}
void nhap(int &n)
{
	cin>>n;
}
int kiemTraSoChinhPhuong(int n)
{
	int i=0;
	while(i*i <=n)
	{
		if(i*i==n)
			return 1;
		i++;
	}
	return 0;
}
int lietKeSoChinhPhuong(int n)
{
	for(int i=1; i<n; i++)
	{
		if(kiemTraSoChinhPhuong(i)==1)
			cout<<i<<" ";
	}
}
