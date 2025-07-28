#include<iostream>
#include<iomanip>
#define SIZE 100
using namespace std;

void diTuan(int x, int y);
void xuat();

int A[SIZE][SIZE]={0},n;
int X[8]={-2,-2,-1, 1, 2, 2, 1,-1};
int Y[8]={-1, 1, 2, 2, 1,-1,-2,-2};
int dem=0;

int main()
{
	int x,y;
	cin>>n>>x>>y;
	diTuan(x,y);
	cout<<"Khong co phuong an";
	return 0;
}

void diTuan(int x, int y)
{
	dem++;
	A[x][y]=dem;
	if(dem==n*n)
	{
		xuat();
		exit(0);
	}
	for(int i=0;i<8;i++)
	{
		int xx=X[i]+x;
		int yy=Y[i]+y;
		if(xx>=0 && xx<n && yy >=0 && yy<n && A[xx][yy]==0)
			diTuan(xx,yy);
	}
	dem--;
	A[x][y]=0;
}

void xuat()
{
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++)
			cout<<setw(3)<<A[i][j]<<" ";
		cout<<endl;
	}
}
