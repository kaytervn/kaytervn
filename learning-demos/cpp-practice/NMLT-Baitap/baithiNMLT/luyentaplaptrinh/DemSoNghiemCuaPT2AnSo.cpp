#include<iostream>
void nhap(int &a, int &b, int &c);
int soCapNghiem(int a, int b, int c);
void xuat(int d);

using namespace std;
int main()
{
	int a,b,c;
	nhap(a,b,c);
	int kq=soCapNghiem(a,b,c);
	xuat(kq);
	return 0;
}

void nhap(int &a, int &b, int &c)
{
	cin>>a>>b>>c;
}

int soCapNghiem(int a, int b, int c)
{
	int dem=0;
	int x,y1;
	
	if((a==0 && b==0 && c==0) || a==0 || b==0)
		return -1;
	else
		for(x=1;x<=c;x++)
		{
			y1= c-a*x;
			if(y1%b==0 && y1>0)
				dem++;
		}
	return dem;
}

void xuat(int d)
{
	cout<<d;
}
