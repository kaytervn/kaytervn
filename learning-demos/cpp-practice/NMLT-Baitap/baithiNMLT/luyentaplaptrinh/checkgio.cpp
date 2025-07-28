#include<iostream>
using namespace std;

bool check(int h, int m, int s)
{
	if(h>=0 && h <= 23 && m>=0 && m <=59 && s>=0 && s<=59)
		return 1;
	else
		return 0;
}

int main()
{
	int h,m,s;
	cin>>h>>m>>s;
	if(check(h,m,s)==0)
		cout<<0;
	else
	{
		if(s==0)
		{
			s=59;
			if(m==0)
			{
				m=59;
				if(h==0)
					h=23;
				else
					h--;
			}
			else
				m--;
		}
		else
			s--;
		cout<<h<<" "<<m<<" "<<s;
	}
}
