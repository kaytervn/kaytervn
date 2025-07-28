#include<iostream>
using namespace std;
void nhap(int &n);
int demSoHoanHao(int n);
bool kiemTraSoHoanHao(int n);
void xuat(int kq);

int main ()
{
	int n;
	nhap(n);
	int kq=demSoHoanHao(n);
	xuat(kq);
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

int demSoHoanHao(int n)
{
	int dem=0;
	for(int i=2; i<n; i++)
	{
		if(kiemTraSoHoanHao(i)==1)
			dem++;
	}
	return dem;
}

void xuat(int kq)
{
	cout<<kq;
}

