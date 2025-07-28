#include<iostream>
#define SIZE 100
using namespace std;

int tinhFn(int n);

int main()
{
	int n;
	cin>>n;
	cout<<tinhFn(n);

	return 0;
}

int tinhFn(int n)
{
	if(n==0||n==1)
		return n;
	if(n%2==0)
		return tinhFn(n/2);
	else
		return tinhFn((n-1)/2) + tinhFn((n+1)/2);
}
