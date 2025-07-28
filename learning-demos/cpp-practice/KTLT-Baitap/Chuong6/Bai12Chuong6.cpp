#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;

void nhap(char A[]);
void quyHoachDong(char A[], char B[], int nA, int nB, int L[][SIZE]);
void xuLy(char A[], char B[], int nA, int nB, int L[][SIZE]);
int timMax(int a, int b);

int main()
{
	char A[SIZE],B[SIZE];
	int L[SIZE][SIZE];
	nhap(A);
	nhap(B);
	int nA=strlen(A);
	int nB=strlen(B);
	quyHoachDong(A,B,nA,nB,L);
	xuLy(A,B,nA,nB,L);
//	for(int i=0;i<=nB;i++)
//	{
//		for(int j=0;j<=nA;j++)
//		{
//			cout<<L[i][j]<<" ";
//		}
//		cout<<endl;
//	}
		
	return 0;
}

void xuLy(char A[], char B[], int nA, int nB, int L[][SIZE])
{
	char T[SIZE];
	int nt=0;
	int i=nB;
	int j=nA;
	while(true)
	{
		if(A[j-1]==B[i-1])
		{
			T[nt]=A[j-1];
//			cout<<T[nt]<<" ";
			i--;
			j--;
			nt++;
		}
		else
		{
			if(timMax(L[i-1][j],L[i][j-1])==L[i-1][j])
			{
				i--;
			}
			else
			{
				j--;
			}
		}
		if(L[i][j]==0)
			break;
	}
	if(nt==0)
		cout<<0;
	else
	{
		T[nt]='\0';
		strrev(T);
		puts(T);
		cout<<nt;
	}
}

void nhap(char A[])
{
	gets(A);
}

int timMax(int a, int b)
{
	if(a>b)
		return a;
	else
		return b;
}

void quyHoachDong(char A[], char B[], int nA, int nB, int L[][SIZE])
{
	for(int i=0;i<nB;i++)
		L[i][0]=0;
	for(int i=0;i<nA;i++)
		L[0][i]=0;
	for(int i=0;i<nB;i++)
	{
		for(int j=0;j<nA;j++)
		{
			if(A[j]==B[i])
				L[i+1][j+1]=L[i][j]+1;
			else
				L[i+1][j+1]=timMax(L[i][j+1],L[i+1][j]);
		}
	}
}
