#include<iostream>
#include<cstring>
#include<ctime>
#include<cstdlib>
#define SIZE 100
using namespace std;

void nguoiDi(int &sum, int &so);
void mayDi(int &sum, int &so, int A[][SIZE], int n);
int traBangPhuongAn(int sum, int so, int A[][SIZE], int n);
int demSo(int A[][SIZE], int n, int i);
void taoBangPhuongAn(int A[][SIZE], int m, int n);
int viTriDauTienKhac0(int A[][SIZE], int n, int i, int vtDau);
void nhapBD(char bd[]);

int main()
{
	srand((unsigned)time (NULL));
	int A[SIZE][SIZE]={0},sum,so,m,n;
	char bd[SIZE];
	m=36;
	n=6;
	taoBangPhuongAn(A,m,n);
	
	sum=0;
	so=0;
	
	cout<<"\t\t\tTRO CHOI 35";
	cout<<"\n\n\tNGUOI di truoc [1] \tMAY di truoc [2]\n\nChon luot di: ";
	nhapBD(bd);
	
	if(bd[0]=='2')
		mayDi(sum,so,A,n);
	while(true)
	{	
		nguoiDi(sum,so);
		if(sum>m-1)
		{
			cout<<"\n\t\t\tBAN DA THUA!";
			break;
		}
		
		mayDi(sum,so,A,n);
		if(sum>m-1)
		{
			cout<<"\n\t\t\tBAN DA THANG!";
			break;
		}
	}
	
	return 0;
}

void nhapBD(char bd[])
{
	gets(bd);
	
	while(!(bd[0]=='2' || bd[0]=='1') || strlen(bd)!=1)
	{
//		cout<<"\n\t\t[Vui long nhap lai so hop le!]\n";
		cout<<"\nChon luot di: ";
		gets(bd);
	}
}

void nguoiDi(int &sum, int &so)
{
	char n[SIZE];
	cout<<"\nLuot cua ban: ";
	gets(n);
	while((n[0]>'5' || n[0]<'1') || strlen(n)!=1 || n[0]-'0'==so)
	{
//		cout<<"\n\t\t[Vui long nhap lai so hop le!]\n";
		cout<<"\nLuot cua ban: ";
		gets(n);
	}
	
	so=n[0]-'0';
	sum +=n[0]-'0';
	cout<<"\t\t\t[Tong hien tai: "<<sum<<"]\n";
}

void mayDi(int &sum, int &so, int A[][SIZE], int n)
{
	int nB;
	nB=traBangPhuongAn(sum,so,A,n);
	cout<<"\nLuot cua may: ";
	cout<<nB<<endl;
	
	so=nB;
	sum +=nB;
	cout<<"\t\t\t[Tong hien tai: "<<sum<<"]\n";
}

void taoBangPhuongAn(int A[][SIZE], int m, int n)
{
	for(int i=m-2;i>=0;i--)
		for(int j=1;j<n;j++)
		{
			if(i+j<m)
				if((demSo(A,n,i+j)==0) || (A[i+j][j]==j && demSo(A,n,i+j)==1))
					A[i][j]=j;
		}
}

int demSo(int A[][SIZE], int n, int i)
{
	int dem=0;
	for(int j=1;j<n;j++)
		if(!A[i][j]==0)
			dem++;
	return dem;
}

int viTriDauTienKhac0(int A[][SIZE], int n, int i, int vtDau)
{
	int cot=-1;
	for(int j=vtDau;j<n;j++)
		if(!A[i][j]==0)
		{
			cot=j;
			return cot;
		}
	return cot;
}

int traBangPhuongAn(int sum, int so, int A[][SIZE], int n)
{
	int r=1+rand()%(n-1);
	int i=0;
	int vt=viTriDauTienKhac0(A,n,sum,i);
	
	if(demSo(A,n,sum)>1)
	{
		while(A[sum][r]==so || A[sum][r]==0)
			r=1+rand()%(n-1);
		return A[sum][r];
	}
	
	if(demSo(A,n,sum)==1 && A[sum][vt]!=so)
		return A[sum][vt];
	
	while(r==so)
		r=1+rand()%(n-1);
	return r;
}
