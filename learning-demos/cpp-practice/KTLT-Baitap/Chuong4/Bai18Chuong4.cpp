#include<iostream>
#define SIZE 100
using namespace std;
int m,n;
int A[SIZE];
int dem=0;

void lietKeNP(int k);
void xuat();
int tinhDoSau();

int main()
{
	cin>>m>>n;
	lietKeNP(0);
//	cout<<dem;
	return 0;
}

void lietKeNP(int k)
{
	if(k==m)
	{
		if(tinhDoSau()==n)
			xuat();
	}
	else
	{
		for(int i=0;i<=1;i++)
		{
			A[k]=i;
			lietKeNP(k+1);
		}
	}
}

void xuat()
{
	dem++;
	for(int i=0;i<m;i++)
		if(A[i]==0)
			cout<<'(';
		else
			cout<<')';
	cout<<endl;
}

int tinhDoSau()
{
	int mongoac=0;
	int dosau=0;
	int i=0;
	while(i<m)
	{
		if(A[i]==0)
			mongoac++;
		else
		{
			if(mongoac==0)
				return -1;
			if(mongoac>dosau)
				dosau=mongoac;
			mongoac--;
		}
		i++;
	}
	if(mongoac==0)
		return dosau;
	else
		return -1;
}
