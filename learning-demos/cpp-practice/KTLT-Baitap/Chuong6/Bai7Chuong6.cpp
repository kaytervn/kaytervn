#include<iostream>
#define SIZE 100
using namespace std;

void nhap(int A[], int &n);
bool ktTang(int A[], int n);
void xuat(int A[], int n);
void lietKeMangConTangDan(int A[], int n);

int T[SIZE],nt=0,tongmax=INT_MIN;

int main()
{
	int n,A[SIZE];
	nhap(A,n);
	lietKeMangConTangDan(A,n);
	return 0;
}

bool ktTang(int A[], int n)
{
	for(int i=0;i<n-1;i++)
		if(A[i]>A[i+1])
			return 0;
	return 1;
}

void xuat(int A[], int n)
{
	for(int i=0;i<n;i++)
		cout<<A[i]<<" ";
	cout<<endl;
}

void tinhTong(int A[], int n)
{
	int s=0;
	for(int i=0;i<n;i++)
		s+=A[i];
	if(s>tongmax)
	{
		tongmax=s;
		nt=n;
		for(int i=0;i<n;i++)
			T[i]=A[i];
	}
}

void lietKeMangConTangDan(int A[], int n)
{
	int B[SIZE],nb=0;
	for(int i=0;i<n;i++)
	{
		B[nb++]=A[i];
		if(i==n-1 || A[i]>A[i+1])
		{
			if(nb>1)
				tinhTong(B,nb);
			nb=0;
		}
	}
	xuat(T,nt);
}

void nhap(int A[], int &n)
{
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}
