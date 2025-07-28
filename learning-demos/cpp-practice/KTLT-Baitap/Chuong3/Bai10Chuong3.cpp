#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

void xuat(char A[], int n);
void nhap(char A[]);
void phanLoaiKyTu(char A[], char thuong[], int &nt, char hoa[], int &nh, char so[], int &ns, char khac[], int &nk);

int main()
{
	char A[SIZE],thuong[SIZE],hoa[SIZE],so[SIZE],khac[SIZE];
	int nt,nh,ns,nk;
	nt=0;
	nh=0;
	ns=0;
	nk=0;
	
	nhap(A);
	phanLoaiKyTu(A,thuong,nt,hoa,nh,so,ns,khac,nk);
	
	cout<<"\nKy tu thuong: ";
	xuat(thuong,nt);
	
	cout<<"\nKy tu hoa: ";
	xuat(hoa,nh);
	
	cout<<"\nKy tu so: ";
	xuat(so,ns);
	
	cout<<"\nKy tu khac: ";
	xuat(khac,nk);
	
	return 0;
}

void xuat(char A[], int n)
{
	if(n==0)
		cout<<"Khong co!\n";
	else
	{
		for(int i=0;i<n;i++)
			cout<<A[i]<<" ";
		cout<<endl;
	}
}

void nhap(char A[])
{
	gets(A);
}

void phanLoaiKyTu(char A[], char thuong[], int &nt, char hoa[], int &nh, char so[], int &ns, char khac[], int &nk)
{
	int len=strlen(A);
	
	for(int i=0;i<len;i++)
	{
		if(A[i]>='a' && A[i]<='z')
			thuong[nt++]=A[i];
		else
			if(A[i]>='A' && A[i]<='Z')
				hoa[nh++]=A[i];
			else
				if(A[i]>='0' && A[i]<='9')
					so[ns++]=A[i];
				else
					khac[nk++]=A[i];
	}
}
