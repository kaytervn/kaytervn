#include<iostream>
#include<bits/stdc++.h>
#define MAX 100
#define INF 1000000
using namespace std;

int findXPosition(int A[], int n, int x)
{
	for(int i=0; i<n; i++)
		if(A[i]==x)
			return i;
}

void deletePosition(int A[], int &n, int x)
{
	for(int i=x; i< n-1; i++)
	{
		A[i] = A[i+1];
	}
	n--;
}

void Dijkstra(int d[], int truoc[], int w[][MAX], int n, int s, int V[])
{
	s--;
	for(int i=0; i<n; i++)
	{
		d[V[i]] = w[s][V[i]];
		truoc[V[i]] = s;
	}
	
	d[s] = 0;
	
	int T[MAX];
	int nT=0;
	
	for(int i=0; i<n; i++)
	{
		T[i] = V[i];
		nT++;
	}
	
	int spos = findXPosition(T,nT,s);
	deletePosition(T,nT,spos);
	
	while(nT != 0)
	{
		int u;
		int min = INF;
		
		for(int i=0; i<nT; i++)
		{
			if(d[T[i]] < min)
			{
				u = T[i];
				min = d[u];
			}
		}
		
		int x =findXPosition(T,nT,u);
		deletePosition(T,nT,x);
		
		for(int i=0; i<nT; i++)
		{
			if(d[T[i]] > d[u] + w[u][T[i]])
			{
				d[T[i]] = d[u] + w[u][T[i]];
				truoc[T[i]] = u;
			}
		}
	}
	
	cout<<"The path from the point '"<<s+1<<"' to other points"<<endl;
	for(int i= 0; i<n ;i++)
	{
		cout<<s+1<<" -> "<<i+1<<":\t";
		if(d[i] == 0 || d[i] == INF)
			cout<<"There is no path!"<<endl;
		else
			cout<<"( "<<d[i]<<", "<<truoc[i]+1<<" )"<<endl;
	}
}

int main()
{
	int d[MAX];
	int truoc[MAX];
	int w[MAX][MAX] = {{INF, 1, INF, INF, 7},
						{INF, INF, 1, 4, 8},
						{INF, INF, INF, 2, 4},
						{INF, INF, 1, INF, INF},
						{INF, INF, INF, 4, INF}};
	int n=5;
	int s=1;
	
	int V[MAX];

	for(int i=0; i<n; i++)
		V[i] = i;
	Dijkstra(d, truoc, w, n, s, V);
	
	return 0;
}
