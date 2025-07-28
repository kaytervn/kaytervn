#include<iostream>
#define SIZE 100
using namespace std;

void sinhHoanVi(int A[], int n);
void latNguoc(int A[], int x, int y);
void doiCho(int &a, int &b);
void xuat(int A[], int n);

int dem=0;
int main()
{
	int A[SIZE], n;
	cin>>n;
	for(int i=0;i<n;i++)
		A[i]=i;
		
	sinhHoanVi(A,n);	
	cout<<dem;
	return 0;
}

void sinhHoanVi(int A[], int n)
{
	xuat(A,n);
	do
	{
		int k=n-2;
		while(k>=0 && A[k]>A[k+1])
			k--;
		if(k<0)
			break;
		int l=n-1;
		while(A[l]<A[k])
			l--;
		doiCho(A[k],A[l]);
		latNguoc(A,k+1,n-1);
		xuat(A,n);
	}
	while(true);
}

void latNguoc(int A[], int x, int y)
{
	while(x<y)
	{
		doiCho(A[x],A[y]);
		x++;
		y--;
	}
}

void doiCho(int &a, int &b)
{
	int t=a;
	a=b;
	b=t;
}

void xuat(int A[], int n)
{
	for(int i=0;i<n;i++)
	{
		cout<<A[i]<<" ";
	}
	cout<<endl;
	dem++;
}
