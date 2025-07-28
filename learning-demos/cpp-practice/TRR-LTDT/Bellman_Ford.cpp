#include<iostream>
#include<bits/stdc++.h>
#define MAX 100
#define INF 1000000
using namespace std;

void BellmanFord(int d[], int truoc[], int w[][MAX], int n, int s, int V[])
{
	for(int i=0; i<n; i++)
	{
		d[V[i]] = w[s][V[i]];
		truoc[V[i]] = s;
	}
	d[s] = 0;
	
	for(int k =1; k<n-1 ; k++)
	{
		for(int i =0; i<n; i++)
		{
			if(V[i] == s)
				continue;
			else
			{
				for(int u= 0; u<n; u++)
				{
					if(d[V[i]] > d[V[u]] + w[V[u]][V[i]])
					{
						if(d[V[u]] == INF || w[V[u]][V[i]] == INF)
							d[V[i]] = INF;
						else
							d[V[i]] = d[V[u]] + w[V[u]][V[i]];
						truoc[V[i]] = V[u];
					}
				}
			}
		}
	}
	
	cout<<"The path from the point '"<<s<<"' to other points:"<<endl;
	for(int i= 0; i<n ;i++)
	{
		cout<<s<<" -> "<<i<<":\t";
		if(d[i] == 0 || d[i] == INF)
			cout<<"There is no path!"<<endl;
		else
			cout<<"( "<<d[i]<<", "<<truoc[i]<<" )"<<endl;
	}
}

int main()
{
	int d[MAX];
	int truoc[MAX];
	int w[MAX][MAX] = {{INF, 1, INF, INF, 3},
						{INF, INF, 3, 3, 8},
						{INF, INF, INF, 1, -5},
						{INF, INF, 2, INF, INF},
						{INF, INF, INF, 4, INF}};
	int n=5;
	int s=0;
	int V[MAX];
	
	for(int i=0; i<n; i++)
		V[i] = i;
	
	BellmanFord(d, truoc, w, n, s, V);
	
	return 0;
}
