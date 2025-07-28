#include<iostream>
#define SIZE 100
using namespace std;

void sinhTapCon();
void xuat(int A[], int k);

int n;

int main()
{
	cin>>n;
	sinhTapCon();	
	
	return 0;
}

void sinhTapCon()
{
	int A[SIZE]={0};
	int k=0;
	int i=0;
	xuat(A,k);
	k=1;
	
	do
	{
		xuat(A,k);
		if(A[i]<n-1)
		{
			A[i+1]=A[i]+1;
			i++;
			k++;
		}
		else
		{
			if(i==0)
				break;
			i--;
			k--;
			A[i]++;
		}
	}
	while(true);
}

void xuat(int A[], int k)
{
	cout<<"{ ";
	for(int i=0;i<k;i++)
		cout<<A[i]<<" ";
	cout<<" }\n";
}
