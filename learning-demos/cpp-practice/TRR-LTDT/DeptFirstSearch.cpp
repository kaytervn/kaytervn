#include<iostream>
#define MAX 100
using namespace std;

int D[MAX];
int V[MAX];
int p[MAX];
int w[MAX][MAX] ={{0, 1, 0, 1, 0, 0, 1, 0},
				{1, 0, 1, 0, 0, 0, 0, 0},
				{0, 1, 0, 1, 0, 1, 0, 0},
				{1, 0, 1, 0, 1, 0, 0, 0},
				{0, 0, 0, 1, 0, 1, 1, 0},
				{0, 0, 1, 0, 1, 0, 0, 1},
				{1, 0, 0, 0, 1, 0, 0, 0},
				{0, 0, 0, 0, 0, 1, 0, 0},
};
int n=8;

void Visit(int u)
{
	D[u] = 1;
	for(int i=0;i<n;i++)
	{
		int v = V[i];
		if(w[u][v])
		{
			if(!D[v])
			{
				p[v]=u;
				cout<<"( "<<p[v]+1<<", "<< v+1<<" )"<<endl;
				Visit(v);
			}
		}
	}
}

int main()
{
	int s=1;
	
	for(int i=0; i< n; i++)
	{
		V[i]=i;
	}
	
	for(int i=0; i<n;i++)
	{
		int u= V[i];
		D[u] = 0;
	}
	p[s] = -1;
	
	Visit(s-1);
	return 0;
}
