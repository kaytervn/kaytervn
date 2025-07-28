#include<bits/stdc++.h>
using namespace std;

bool check(int &a, int &b, int a1, int b1)
{
	if(a1==1&&b1==3 || a1==3&&b1==2 || a1==2&&b1==1)
		a+=3;
	else
		if(a1==b1)
		{
			a+=1;
			b+=1;
		}
	else
		b+=3;


}

int main()
{
	int x,y,z,t,u,v,a,b,c;
	a=0;
	b=0;
	c=0;
	cin>>x>>y>>z>>t>>u>>v;
	check(a,b,x,y);
	check(a,c,z,t);
	check(b,c,u,v);
	cout<<a<<" "<<b<<" "<<c;
}
