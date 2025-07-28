#include<iostream>
#include<bits/stdc++.h>
#define SIZE 100
using namespace std;

string tinhFn(string A[], int n);

int main()
{
//	int n,A[SIZE];
//	cin>>n;
//	cout<<tinhFn(A,n);
	string A[SIZE];
	int n;
	cin>>n;
	tinhFn(A,n);
	return 0;
}

string tong2soLon(string a, string b)
{
	while(a.size()<b.size())
		a="0"+a;
	while(b.size()<a.size())
		b="0"+b;
	reverse(a.begin(),a.end());
	reverse(b.begin(),b.end());
	
	int t=0;
	int nho=0;
	string s="";
	
	for(int i=0;i<a.size();i++)
	{
		t=(a[i]-'0') + (b[i]-'0') + nho;
		s+= t%10 + '0';
		nho= t/10;
	}
	
	if(nho==1)
		s+="1";
	reverse(s.begin(),s.end());
	return s;
}

string tinhFn(string A[], int n)
{
	A[0]="0";
	A[1]="1";
	for(int i=1;i<=n;i++)
	{
		A[2*i]=A[i];
		A[2*i+1]=tong2soLon(A[i],A[i+1]);
	}
	cout<< A[n];
}
