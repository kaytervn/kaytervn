#include<iostream>
#include<cstring>
void nhap(char &a);
int thuongSangHoa(char a);
void xuat(char t);
using namespace std;
int main()
{
    char a;
    nhap (a);
    int t=thuongSangHoa(a);
    xuat(t);
	return 0;
}
void nhap(char &a)
{
	cout<<"Nhap 1 chu cai bat ki: "; cin>>a;
}
int thuongSangHoa(char a)
{
    int k;
	if ((a>='A')&&(a<='Z'))
		k=int(a)+32;
    else if ((a>='a')&&(a<='z'))
		k=int(a)-32;
	else return 0;
	return k;
}
void xuat(char t)
{
	if (t==0)
	cout<<"Error!";
	else
	cout<<"Sau khi duoc chuyen doi: "<<t;
}

