#include<iostream>
void nhap(int &n,int A[]);
int lkSoDauChan(int n, int A[]);
bool checkSoDauChan(int n);
void xuat(int kq);
using namespace std;

int main()
{
	int n,A[1000];
	nhap(n,A);
	lkSoDauChan(n,A);
	xuat;
	return 0;
}

void nhap(int &n,int A[])
{
	cin>>n;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

int lkSoDauChan(int n, int A[])
{
	for(int i=0;i<n;i++)
	{
		if(checkSoDauChan(A[i]))
			xuat(A[i]);
	}
}

bool checkSoDauChan(int n)
{
	while(n>=10)
		n /=10;
	if(n%2==0)
		return 1;
	else
		return 0;
}

void xuat(int n)
{
	cout<<n<<" ";
}
