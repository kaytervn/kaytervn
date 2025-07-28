#include<iostream>
#define SIZE 100
using namespace std;

void lietKeNhiPhan(int k);
void xuat();
void nhap(int A[]);
void tinhCP();

int A[SIZE],B[SIZE],P[SIZE],H[SIZE],n;
int tgtu=INT_MAX;

int main()
{
	cin>>n;
	nhap(A);
	nhap(B);
	lietKeNhiPhan(0);
	xuat();
	cout<<"Thoi gian toi uu: "<<tgtu;
	return 0;
}

void nhap(int A[])
{
	for(int i=0;i<n;i++)
		cin>>A[i];
}

void tinhCP()
{
	int ta=0;
	int tb=0;
	for(int i=0;i<n;i++)
		if(P[i]==0)
			ta+=A[i];
		else
			tb+=B[i];
	int tg=ta;
	if(ta<tb)
		tg=tb;
	if(tg<tgtu)
	{
		tgtu=tg;
		for(int i=0;i<n;i++)
			H[i]=P[i];
	}
}

void lietKeNhiPhan(int k)
{
	if(k==n)
		tinhCP();
	else
	{
		for(int i=0;i<=1;i++)
		{
			P[k]=i;
			lietKeNhiPhan(k+1);
		}
	}
}

void xuat()
{
	cout<<endl;
	for(int i=0;i<n;i++)
		cout<<H[i]<<" ";
	cout<<endl;
}
