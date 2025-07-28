#include<iostream>
#define SIZE 100
using namespace std;

int minLeLonHonMaxChan(int A[], int n);
int minLe(int A[], int n);
int maxChan(int A[], int n);

int main()
{
	int A[SIZE],n;
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
	int kq=minLeLonHonMaxChan(A,n);
	cout<<kq;
	
	return 0;
}

int minLeLonHonMaxChan(int A[], int n)
{
	int min=minLe(A,n);
	int max=maxChan(A,n);
	if(min>max)
		return min;
	else
		return -1;
}

int minLe(int A[], int n)
{
	int min=-1;
	
	for(int i=0;i<n;i++)
	{
		if(A[i]%2!=0)
			min=A[i];
	}
	
	for(int i=0;i<n;i++)
	{
		if(A[i]%2!=0 && A[i]<=min)
			min=A[i];
	}
	
	return min;
}

int maxChan(int A[], int n)
{
	int max=-1;
	
	for(int i=0;i<n;i++)
	{
		if(A[i]%2==0)
			max=A[i];
	}
	
	for(int i=0;i<n;i++)
	{
		if(A[i]%2==0 && A[i]>=max)
			max=A[i];
	}
	
	return max;
}
