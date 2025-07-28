#include<iostream>
#include<fstream>
#include<ctime>
#include<cstdlib>
using namespace std;

void taoFileChan(int n);
void docFile(int A[], int n);
void xuat(int A[], int n);

int main()
{
	int n, A[300];
	n=10;
	taoFileChan(n);
	docFile(A,n);
	xuat(A,n);
	return 0;
}

void xuat(int A[], int n)
{
	int i=0;
	while(i<n*30)
	{
		int B[30];
		for(int j=0;j<30;j++)
		{
			B[j]=A[i++];
			cout<<B[j]<<" ";
		}
		cout<<endl;
	}
}

void docFile(int A[], int n)
{
	fstream input;
	input.open("SOCHAN.DAT", ios::in);
	
	if(input)
	{
		int i=0;
		while(i<n*30)
		{
			input>>A[i];
			i++;
		}
		input.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void taoFileChan(int n)
{
	fstream output;
	output.open("SOCHAN.DAT", ios::out);
	
	if(output)
	{
		srand((unsigned)time (NULL));

		for(int i=0;i<n;i++)
		{
			for(int j=0;j<30;j++)
			{
				int x=rand()%100;
				while(x%2!=0)
					x=rand()%100;
				output<<x<<" ";
			}
			output<<endl;
		}
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}
