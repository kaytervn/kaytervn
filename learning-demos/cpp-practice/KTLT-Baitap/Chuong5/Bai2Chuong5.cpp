#include<iostream>
#define SIZE 100
using namespace std;

bool laSoAmstrong(int n);
int demChuSo(int n);
int tinhXmuP(int x, int p);
int tinhTongSoAmstrong(int A[], int n);

int main()
{
	int A[SIZE];
	int n;
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
	int kq=tinhTongSoAmstrong(A,n);
	cout<<kq;
	
	return 0;
}

int tinhTongSoAmstrong(int A[], int n)
{
	int s=0;
	for(int i=0;i<n;i++)
	{
		if(laSoAmstrong(A[i])==1)
			s+=A[i];
	}
	return s;
}

int demChuSo(int n)
{
	int dem=0;
	while(n>0)
	{
		int tmp=n%10;
		dem++;
		n/=10;
	}
	return dem;
}

int tinhXmuP(int x, int p)
{
	if(p==1)
		return x;
	else
		return x*tinhXmuP(x,p-1);
}

bool laSoAmstrong(int n)
{
	int k=demChuSo(n);
	int s=0;
	int cpy=n;
	while(n>0)
	{
		int tmp=n%10;
		s+=tinhXmuP(tmp,k);
		n/=10;
	}
	if(s==cpy)
		return 1;
	else
		return 0;
}
