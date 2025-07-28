#include<iostream>
void nhap(int &n,int A[]);
int checkTangDan(int n, int A[]);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	int kq=checkTangDan(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int checkTangDan(int n, int A[])
{
	int t=-1;
	if(A[0]>A[1])
		t=1;
	for(int i=1;i<n;i++)
	{
		if(A[i-1]>=A[i])
		{
			t=i;
			break;			
		}
	}
	return t;
}

void xuat(int n)
{
	cout<<n;
}
