#include<iostream>
#include<cmath>
using namespace std;

struct PHANSO
{
	int tu;
	int mau;
};

struct HONSO
{
	int nguyen;
	PHANSO ps;
};

void xuatPS(PHANSO a);
PHANSO doiHSsangPS(HONSO a);
PHANSO rutGon1PS(PHANSO a);
PHANSO xuLyDauTru(PHANSO a);
int UCLN(int a, int b);
void nhapHS(HONSO &a);
void xuatHS(HONSO a);
HONSO tong2HS(HONSO a, HONSO b);
HONSO doiPSsangHS(PHANSO a);
PHANSO tong2PS(PHANSO a, PHANSO b);
PHANSO tich2PS(PHANSO a, PHANSO b);
HONSO tich2HS(HONSO a, HONSO b);
void nhapPS(PHANSO &a);

int main()
{
	HONSO a, b;
	nhapHS(a);
	nhapHS(b);
	xuatPS(doiHSsangPS(a));
	xuatPS(doiHSsangPS(b));
	xuatHS(tong2HS(a,b));
	xuatHS(tich2HS(a,b));
	
	return 0;
}

HONSO tich2HS(HONSO a, HONSO b)
{
	PHANSO s;
	s= tich2PS(doiHSsangPS(a),doiHSsangPS(b));
	return doiPSsangHS(s);
}

PHANSO tich2PS(PHANSO a, PHANSO b)
{
	PHANSO tich;
	tich.tu= a.tu*b.tu;
	tich.mau= a.mau*b.mau;
	return rutGon1PS(tich);
}

void xuatHS(HONSO a)
{
	cout<<a.nguyen<<"("<<a.ps.tu<<"/"<<a.ps.mau<<")"<<endl;
}

HONSO tong2HS(HONSO a, HONSO b)
{
	PHANSO s;
	s= tong2PS(doiHSsangPS(a),doiHSsangPS(b));
	return doiPSsangHS(s);
}

PHANSO tong2PS(PHANSO a, PHANSO b)
{
	PHANSO tong;
	tong.tu= a.tu*b.mau + b.tu*a.mau;
	tong.mau= a.mau*b.mau;
	return rutGon1PS(tong);
}

HONSO doiPSsangHS(PHANSO a)
{
	HONSO tam;
	a= rutGon1PS(a);
	tam.nguyen= a.tu/a.mau;
	tam.ps.tu= a.tu%a.mau;
	tam.ps.mau= a.mau;
	
	return tam;
}

void xuatPS(PHANSO a)
{
	cout<<a.tu<<"/"<<a.mau<<endl;
}

PHANSO doiHSsangPS(HONSO a)
{
	PHANSO tam;
	tam.tu=a.nguyen*a.ps.mau +a.ps.tu;
	tam.mau=a.ps.mau;
	return rutGon1PS(tam);
}

PHANSO rutGon1PS(PHANSO a)
{
	PHANSO kq;
	if(a.tu==0)
	{
		kq.tu=0;
		kq.mau=a.mau;
	}
	else
	{
		int m=UCLN(a.tu,a.mau);
		kq.tu= a.tu/m;
		kq.mau= a.mau/m;
	}

	return xuLyDauTru(kq);
}

PHANSO xuLyDauTru(PHANSO a)
{
	PHANSO tam;
	tam.tu=a.tu;
	tam.mau=a.mau;
	
	if(a.tu*a.mau >0)
	{
		tam.tu= abs(a.tu);
		tam.mau= abs(a.mau);
	}
	else
		if(a.mau<0)
		{
			tam.tu= -a.tu;
			tam.mau= -a.mau;
		}
		
	return tam;
}

int UCLN(int a, int b)
{
	a=abs(a);
	b=abs(b);
	
	if(a*b==0)
		return a+b;
	
	while(a != b)
		if(a>b)
			a -= b;
		else
			b -=a;
	return a;
}

void nhapHS(HONSO &a)
{
	cin>>a.nguyen>>a.ps.tu>>a.ps.mau;
}
