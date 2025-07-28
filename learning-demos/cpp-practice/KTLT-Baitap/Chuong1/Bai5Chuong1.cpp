#include<iostream>
using namespace std;

struct SOPHUC
{
	int thuc;
	int ao;
};

SOPHUC tong(SOPHUC a, SOPHUC b);
SOPHUC hieu(SOPHUC a, SOPHUC b);
SOPHUC tich(SOPHUC a, SOPHUC b);
void xuatSP(SOPHUC a);
void nhapSP(SOPHUC &a);

int main()
{
	SOPHUC a,b;
	nhapSP(a);
	nhapSP(b);
	
	cout<<"Tong: ";
	xuatSP(tong(a,b));
	
	cout<<"Hieu: ";
	xuatSP(hieu(a,b));
	
	cout<<"Tich: ";
	xuatSP(tich(a,b));
	
	return 0;
}

SOPHUC tong(SOPHUC a, SOPHUC b)
{
	SOPHUC tong;
	tong.thuc= a.thuc +b.thuc;
	tong.ao= a.ao +b.ao;
	
	return tong;
}

SOPHUC hieu(SOPHUC a, SOPHUC b)
{
	SOPHUC hieu;
	hieu.thuc= a.thuc -b.thuc;
	hieu.ao= a.ao -b.ao;
	
	return hieu;
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
