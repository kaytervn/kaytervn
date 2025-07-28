#include<iostream>
using namespace std;

void nhap(int &a);
void xuat(int a);
int xuLy(int a);

int main()
{
	int a;
	nhap(a);
	int kq=xuLy(a);
	xuat(kq);
	return 0;
}

void nhap(int &a)
{
	cin>>a;
}

int xuLy(int a)
{
	double s=0;
	int n=1;
	
	while(s<=a)
	{
		s += 1.0/(double)n;
		if(s>a)
			break;
		n++;
	}
	return n;
}

void xuat(int a)
{
	cout<<a;
}
