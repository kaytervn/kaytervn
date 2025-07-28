#include<bits/stdc++.h>
#include<queue>
#define MAX 100
using namespace std;

void BreadthFirstSearch(queue<int> Q, int D[], int V[], int p[], int w[][MAX], int s, int n)
{
	s--;
	
	for(int i=0; i<n; i++)
	{
		int u= V[i];
		D[u] = 0;
	}
	
	D[s] = 1;
	p[s] = -1;
	
	Q.push(s);

	while(!Q.empty())
	{
		int u = Q.front();
		for(int i=0; i<n; i++)
		{
			int v = V[i];
			if(w[v][u])
			{
				if(D[v] == 0)
				{
					D[v] = 1;
					p[v] = u;
					Q.push(v);
					cout<<"( "<<p[v]+1<<", "<< v+1<<" )"<<endl;
				}
			}
		}
		Q.pop();
	}
}

int main()
{
	queue<int> Q;
	int D[MAX];
	int V[MAX];
	int p[MAX];
	int w[MAX][MAX] ={{0, 1, 0, 1, 0, 0, 1, 0},
					{1, 0, 1, 0, 0, 0, 1, 0},
					{0, 1, 0, 1, 0, 1, 0, 0},
					{1, 0, 1, 0, 1, 0, 0, 0},
					{0, 0, 0, 1, 0, 1, 1, 0},
					{0, 0, 1, 0, 1, 0, 0, 1},
					{1, 1, 0, 0, 1, 0, 0, 0},
					{0, 0, 0, 0, 0, 1, 0, 0}};
	int s=1;
	int n=8;
	
	for(int i=0; i< n; i++)
	{
		V[i]=i;
	}
	
	BreadthFirstSearch(Q, D, V, p, w, s, n);
	
	return 0;
}
