#include<bits/stdc++.h>
using namespace std;

int timMin(int a, int b)
{
	if(a<b)
		return a;
	else
		return b;
}

int main()
{
	int n, A[10000], B[10000];
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
	
	for(int i=0;i<n;i++)
		cin>>B[i];
	
	int min=B[0]/A[0];
	for(int i=1;i<n;i++)
		min=timMin(min,B[i]/A[i]);
	cout<<min;
}
