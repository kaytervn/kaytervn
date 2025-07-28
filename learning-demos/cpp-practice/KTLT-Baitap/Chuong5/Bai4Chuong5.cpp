#include<iostream>
using namespace std;

void batBit(int &n, int k);
int layBit(int n, int k);
void tatBit(int &n, int k);

int main()
{
	int n,k;
	cin>>n>>k;
	int kq=layBit(n,k);
	cout<<kq;
	return 0;
}

int layBit(int n, int k)
{
	return (n>>k) & 0x1;
}

void batBit(int &n, int k)
{
	n=n | (0x1<<k);
}

void tatBit(int &n, int k)
{
	n=n & (~(0x1<<k));
}
