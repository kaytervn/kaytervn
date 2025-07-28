#include<iostream>
#define SIZE 100
using namespace std;

struct SOPHUC
{
	int thuc;
	int ao;
};

SOPHUC tichMang(int n, SOPHUC a[]);
SOPHUC tongMang(int n, SOPHUC a[]);
void nhapMangSP(int &n, SOPHUC a[]);
SOPHUC tong(SOPHUC a, SOPHUC b);
SOPHUC tich(SOPHUC a, SOPHUC b);
void xuatSP(SOPHUC a);
void nhapSP(SOPHUC &a);

int main()
{
	int n;
	SOPHUC a[SIZE];
	nhapMangSP(n,a);
	
	cout<<"Tong mang: ";
	xuatSP(tongMang(n,a));
	
	cout<<"Tich: ";
	xuatSP(tichMang(n,a));
	return 0;
}

SOPHUC tichMang(int n, SOPHUC a[])
{
	SOPHUC s=a[0];
	for(int i=1;i<n;i++)
		s= tich(s,a[i]);
	return s;
}

SOPHUC tongMang(int n, SOPHUC a[])
{
	SOPHUC s=a[0];
	for(int i=1;i<n;i++)
		s= tong(s,a[i]);
	return s;
}

void nhapMangSP(int &n, SOPHUC a[])
{
	cin>>n;
	for(int i=0;i<n;i++)
		nhapSP(a[i]);
}

SOPHUC tong(SOPHUC a, SOPHUC b)
{
	SOPHUC tong;
	tong.thuc= a.thuc +b.thuc;
	tong.ao= a.ao +b.ao;
	
	return tong;
}

SOPHUC tich(SOPHUC a, SOPHUC b)
{
	SOPHUC tich;
	tich.thuc= a.thuc*b.thuc -a.ao*b.ao;
	tich.ao= a.thuc*b.ao +a.ao*b.thuc;
	
	return tich;
}

void xuatSP(SOPHUC a)
{
	cout<<"z= "<<a.thuc;
	if(a.ao>0)
		cout<<" +"<<a.ao<<"i"<<endl;
	else
		cout<<" "<<a.ao<<"i"<<endl;
}

void nhapSP(SOPHUC &a)
{
	cin>>a.thuc>>a.ao;
}
