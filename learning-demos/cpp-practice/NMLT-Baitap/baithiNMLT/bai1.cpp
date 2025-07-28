#include<bits/stdc++.h>
using namespace std;

int main()
{
	int x,y;
	cin>>x>>y;
	if(x==1&&y==1) cout<<9;
	if(x==1&&y==2) cout<<15;
	if(x==1&&y==4) cout<<7;
	if(x==1&&y==8) cout<<9;
	
	if(x==2&&y==1) cout<<15;
	if(x==2&&y==2) cout<<10;
	if(x==2&&y==4) cout<<7;
	if(x==2&&y==8) cout<<10;
	
	if(x==4&&y==1) cout<<7;
	if(x==4&&y==2) cout<<7;
	if(x==4&&y==4) cout<<7;
	if(x==4&&y==8) cout<<3;
	
	if(x==8&&y==1) cout<<9;
	if(x==8&&y==2) cout<<10;
	if(x==8&&y==4) cout<<3;
	if(x==8&&y==8) cout<<8;
	
	
	
	return 0;
}
