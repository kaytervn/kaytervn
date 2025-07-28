#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n, A[1000];
	cin>>n;
	for(int i=0;i<n;i++)
		cin>>A[i];
		
	for(int i=1;i<n-1;i++)
		if((A[i]%2==0&&A[i+1]%2==0)||(A[i]%2!=0&&A[i+1]%2!=0))
		{
			cout<<i+1;
			return 0;
		}
	cout<<-1;

}
