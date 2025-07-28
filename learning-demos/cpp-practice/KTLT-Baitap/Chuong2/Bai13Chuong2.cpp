#include<iostream>
#include<ctime>
#include<cstdlib>
#define MAX 20
using namespace std;

void nhap(int &n, int &mine);
void xuat(int A[][MAX], int n);
void datMin(int A[][MAX], int n, int soMin);
void datSoDem(int A[][MAX], int n);
int demSoMin(int A[][MAX], int i, int j);

int main()
{
	srand((unsigned)time (NULL));
	int A[MAX][MAX]={0}, n, soMin;
	nhap(n,soMin);
	datMin(A,n,soMin);
	datSoDem(A,n);
	cout<<"\n\tCHU THICH: \n\n[9]: Min.\t[k]: Xung quanh co k min.\n\n";
	xuat(A,n);
	return 0;
}

void datMin(int A[][MAX], int n, int soMin)
{
	while(soMin>0)
	{
		int x=1+rand()%n;
		int y=1+rand()%n;
				
		if(A[x][y]!=9 && demSoMin(A,x,y)<4)
		{
			A[x][y]=9;
			soMin--;
		}
	}
}

void datSoDem(int A[][MAX], int n)
{
	for(int i=1;i<n+1;i++)
		for(int j=1;j<n+1;j++)
			if(A[i][j]!=9)
				A[i][j]=demSoMin(A,i,j);
}

int demSoMin(int A[][MAX], int i, int j)
{
	int X[8]={0,0,-1,1,-1,1,-1,1};
	int Y[8]={1,-1,0,0,-1,1,1,-1};
	
	int dem=0;
	for(int k=0;k<8;k++)
		if(A[i+X[k]][j+Y[k]]==9)
			dem++;

	return dem;
}

void xuat(int A[][MAX], int n)
{
	for(int i=1;i<n+1;i++)
	{
		for(int j=1;j<n+1;j++)
			cout<<A[i][j]<<" ";
		cout<<endl;
	}
}

void nhap(int &n, int &soMin)
{
	do
	{
		cout<<"Nhap kich thuoc [5 <= n <= 18]: ";
		cin>>n;
	} while(n>18 || n<5);
	
	do
	{
		cout<<"Nhap so luong min: [1 <= mines"<<" <= "<< (n*n)/4<<"]: ";
		cin>>soMin;
	} while(soMin> (n*n)/4 || soMin<1);
}
