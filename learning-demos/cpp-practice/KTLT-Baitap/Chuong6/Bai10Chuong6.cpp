#include<iostream>
#define SIZE 10000
#include<cstring>
using namespace std;
void daoChuoi(char A[], int n);
void latNguoc(char A[], int x, int y);

int main()
{
	char A[SIZE];
	gets(A);
	int n=strlen(A);
	daoChuoi(A,n);
	cout<<A;
	return 0;
}

void latNguoc(char A[], int x, int y)
{
	while(x<y)
	{
		char tmp=A[x];
		A[x]=A[y];
		A[y]=tmp;
		x++;
		y--;
	}
}

void daoChuoi(char A[], int n)
{
	int dem=0;
	for(int i=0;i<n;i++)
	{
		if(A[i]==' ')
			continue;
		dem++;
		if(A[i+1]==' ' || A[i+1]=='\0')
		{
//			cout<<dem<<endl;
			latNguoc(A,i+1-dem,i);
			dem=0;
		}
	}
}
