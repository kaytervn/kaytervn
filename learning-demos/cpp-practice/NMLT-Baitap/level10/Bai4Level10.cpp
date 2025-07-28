#include<iostream>
#include<cstring>
void nhap(char a[]);
int demTu(char str[]);
void xuat(int d);

using namespace std;
int main()
{
	char str[100];
	nhap(str);
	int kq=demTu(str);
	xuat(kq);
	return 0;
}

void nhap(char a[])
{
	gets(a);
}

int demTu(char str[])
{
	int len= strlen(str);
    int dem = (str[0] != ' '); //Ky tu dau khong phai khoang trang =1, nguoc lai =0
    for (int i=0; i<len-1; i++)
        if (str[i]==' ' && str[i+1]!=' ')
            dem++;
    return dem;
}

void xuat( int d)
{
	cout<<d;
}
