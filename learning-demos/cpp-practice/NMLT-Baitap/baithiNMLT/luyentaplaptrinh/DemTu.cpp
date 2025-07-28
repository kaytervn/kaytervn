#include<iostream>
#include <string.h>
void nhap(char a[]);
int wordCount(char str[]);
void xuat(int d);

using namespace std;
int main()
{
	char str[1000];
	nhap(str);
	int kq=wordCount(str);
	xuat(kq);
	return 0;
}

void nhap(char a[])
{
	gets(a);
}

int wordCount(char str[])
{
	int length= strlen(str);
    int word = (str[0] != ' '); //Ky tu dau khong phai khoang trang ==1
    for (int i = 0; i < length - 1; i++)
        if (str[i] == ' ' && str[i + 1] != ' ')
            word++;
    return word;
}

void xuat( int d)
{
	cout<<d;
}
