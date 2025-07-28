#include<iostream>
void nhap(int &n, int A[], int &x);
int lamTron(double a);
double tinhTBC(int n, int A[],int x);
void xuat(double kq);
using namespace std;

int main()
{
	int n, A[1000],x;
	nhap (n,A,x);
	double kq=tinhTBC(n, A,x);
	xuat (kq);
	return 0;
}

void nhap(int &n, int A[], int &x)
{
	cin>>n>>x;
	for(int i=0; i<n;i++)
		cin>>A[i];
}

double tinhTBC(int n, int A[], int x)
{
	int dem=0;
		double k=0;
		for(int i=0;i<n;i++)
			if(A[i]%x != 0)
			{
				k += A[i];
				dem++;
			}
		if(dem!=0)
			return lamTron(k/dem);
}

int lamTron(double a)
{
	int h;
		if ((a-int(a))>=0.5)
			h=int(a)+1;
		else h=int(a);
	return h;
}

void xuat(double kq)
{
	cout<<kq;
}
