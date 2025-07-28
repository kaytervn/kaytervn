#include<iostream>
using namespace std;
long long tinhTongS(long long n);
void nhap(long long &n);
void xuat(long long kq);
int main ()
{
	long long n;
	nhap(n);
	long long kq = tinhTongS(n);
	xuat (kq);
	return 0;
}
void nhap(long long &n)
{
	cin>>n;
}
long long tinhTongS(long long n)
{
	long long s=0;
	for(long long i=1;i<=n;i++)
	{
		s +=i;
		if(s>=n)
        {
            int k=i-1;
            return k;

        }
	}

	return 0;
}
void xuat(long long kq)
{
	cout<<kq;
}
