#include<iostream>
using namespace std;
int inCacSoThoaMan();
int main()
{
	inCacSoThoaMan();
	return 0;
}
int inCacSoThoaMan()
{
	for (int i = 10; i < 99; i++)
	{
		int a= i/10;
		int b= i%10;
		if (a*b == 2*(a+b))
			cout<<i<<" ";
	}
}

