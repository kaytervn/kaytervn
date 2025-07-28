#include<iostream>
using namespace std;
void nhap(int &n, int A[]);
int GTsoGanhDautien(int n, int A[]);
bool checkSoDoiXung(int n);
void xuat(int n);

int main()
{
	int n,A[1000];
	nhap(n, A);
	int kq=GTsoGanhDautien(n,A);
	xuat(kq);
	return 0;
}

void nhap(int &n, int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int GTsoGanhDautien(int n, int A[])
{
	for(int i=0;i<n;i++)
		if(A[i]>100 && checkSoDoiXung(A[i]))
			return A[i];
}

bool checkSoDoiXung(int n)
{
	int tmp=n; 
	int s=0;
	while(n>0)
	{
		int r=n%10;
		s= s*10 + r;
		n /= 10;
	}
	if (s==tmp)
		return 1;
	else
		return 0;
}

void xuat(int n)
{
	cout<<n;
}
