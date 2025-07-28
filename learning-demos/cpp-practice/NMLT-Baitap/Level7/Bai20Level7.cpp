#include<iostream>
using namespace std;
void nhap(int &n, double A[]);
bool checkDoiXung(int n, double A[]);
void hoanDoi(double&a,double &b);
void xuat(int n);

int main()
{
	int n;
	double A[1000];
	nhap(n, A);
	bool kq=checkDoiXung(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n, double A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

bool checkDoiXung(int n, double A[])
{
	int x=0;
	int y=n-1;
	while(x<y)
	{
		if(A[x] != A[y])
			return 0;
		x++;
		y--;
	}
	return 1;
}

void xuat(int n)
{
	if(n)
		cout<<"Doi xung";
	else
		cout<<"KHONG doi xung";
}
