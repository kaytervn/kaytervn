#include <iostream> 
void nhap(int &year);
void xuat(int kt, int year);
bool ktNamNhuan(int y);
using namespace std;
int main() 
{ 
    int year;
    nhap(year);
    int kt=ktNamNhuan(year);
    xuat(kt, year);
    return 0; 
}
bool ktNamNhuan(int year)
{ 
	return( year>0 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) );
}

void nhap(int &year)
{
	cout<<"Nhap nam: "; cin>>year;
}
void xuat(int kt, int year)
{
	if (kt==1)
	printf("Nam %d la nam nhuan!", year);
	else
	printf("Nam %d khong phai nam nhuan!", year);
}
