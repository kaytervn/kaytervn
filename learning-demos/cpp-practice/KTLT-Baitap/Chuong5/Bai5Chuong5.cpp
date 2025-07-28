#include<iostream>
using namespace std;

int layBit(int n, int k);
int demBit1(int n, int dem, int khuon);

int main()
{
	int n,k;
	int dem=0;
	cin>>n;
//	cout<<demBit1(n,dem,32)<<endl;
//	cout<<demBit1(n,dem,16)<<endl;
	cout<<demBit1(n,dem,32);

	return 0;
}

int layBit(int n, int k)
{
	return (n>>k) & 0x1;
}

int demBit1(int n, int dem, int khuon)
{
	for(int i=0;i<khuon;i++)
	{
		if(layBit(n,i)==1)
			dem++;
	}
	return dem;
}
