#include<iostream>
void nhap(int A[], int &n);
int SCPmax(int A[], int n);
bool ktSCP(int n);
void xuat(int kq);
using namespace std;

int main ()
{
	int A[1000], n;
	nhap(A, n);
	int kq=SCPmax(A, n);
	xuat(kq);
	return 0;
}
void nhap(int A[], int &n)
{
		cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
}
int SCPmax(int A[], int n)
{
	int max=-1;
	for(int i=0;i<n;i++)
		if(ktSCP(A[i])==1)
			max=A[i];
	for(int i=0;i<n;i++)
		if(ktSCP(A[i])==1&&A[i]>max)
			max=A[i];
	return max;
}
bool ktSCP(int n)
{
	int i=0;
	while(i*i <=n)
	{
		if(i*i==n)
			return 1;
		i++;
	}
	return 0;
}
void xuat(int kq)
{
	cout<<kq;
}
