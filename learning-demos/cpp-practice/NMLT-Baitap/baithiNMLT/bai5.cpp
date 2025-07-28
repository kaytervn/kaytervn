#include<bits/stdc++.h>
using namespace std;

int main()
{
	char S[100][100], min[100], tam[100], cheo1[100], cheo2[100];
	int n;
	gets(S[0]);
	n=strlen(S[0]);
	
	for(int i=1;i<n;i++)
		gets(S[i]);
	
	strcpy(min,S[0]);
	
	//Hang
	for(int i=1;i<n;i++)
		if(strcmp(S[i],min)<0)
			strcpy(min,S[i]);
	
	//Cot
	for(int j=0;j<n;j++)
	{
		for(int i=0;i<n;i++)
			tam[i]=S[i][j];
		tam[n]='\0';
		if(strcmp(tam,min)<0)
			strcpy(min,tam);	
	}
	
	//Cheo
	for(int i=0;i<n;i++)
	{
		cheo1[i]=S[i][i];
		cheo2[i]=S[i][n-i-1];
	}
	
	cheo1[n]='\0';
	cheo2[n]='\0';
	
	if(strcmp(cheo1,min)<0)
		strcpy(min,cheo1);

	if(strcmp(cheo2,min)<0)
		strcpy(min,cheo2);	
	
	cout<<min;
	return 0;
}
