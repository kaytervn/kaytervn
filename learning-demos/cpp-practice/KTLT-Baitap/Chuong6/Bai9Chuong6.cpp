#include<iostream>
#define SIZE 100
#include<cstring>
#include<string>
using namespace std;
void demTanSuatTungKyTu(char A[], int n);

int main()
{
	char A[SIZE];
	cin.getline(A,SIZE);
	int n=strlen(A);
	demTanSuatTungKyTu(A,n);
	return 0;
}

void demTanSuatTungKyTu(char A[], int n)
{
	for(int i=0;i<n;i++)
	{
		bool kt=1;
		for(int j=i-1;j>=0;j--)
		{
			if(A[i]==A[j])
			{
				kt=0;
				break;
			}
		}
		if(kt==1)
		{
			int dem=0;
			for(int k=0;k<n;k++)
			{
				if(A[i]==A[k])
					dem++;
			}
			cout<<A[i]<<": "<<dem<<endl;
		}
	}
}
