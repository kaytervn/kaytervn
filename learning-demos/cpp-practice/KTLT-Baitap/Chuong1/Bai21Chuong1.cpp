#include<iostream>
#include<fstream>
#include<ctime>
#include<cstdlib>
using namespace std;

void ghiFileLe(int A[], int n);
void ghiFileChan(int A[], int n);
void docFile(int A[]);
void taoFile(int n);

int main()
{
	int A[1000],n;
	n=1000;
	taoFile(n);
	docFile(A);
	ghiFileChan(A,n);
	ghiFileLe(A,n);
	return 0;
}

void ghiFileLe(int A[], int n)
{
	fstream output;
	output.open("SOLE.OUT", ios::out);
	
	if(output)
	{
		for(int i=0;i<n;i++)
		{
			if(A[i]%2!=0)
				output<<A[i]<<" ";
		}
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void ghiFileChan(int A[], int n)
{
	fstream output;
	output.open("SOCHAN.OUT", ios::out);
	
	if(output)
	{
		for(int i=0;i<n;i++)
		{
			if(A[i]%2==0)
				output<<A[i]<<" ";
		}
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void docFile(int A[])
{
	fstream input;
	input.open("SONGUYEN2.INP", ios::in);
	
	if(input)
	{
		int i=0;
		while(true)
		{
			input>>A[i];
			
			if(input.eof())
				break;
//			cout<<A[i]<<" ";
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

void taoFile(int n)
{
	fstream output;
	output.open("SONGUYEN2.INP", ios::out);
	
	if(output)
	{
		srand((unsigned)time (NULL));

		for(int i=0;i<n;i++)
		{
			int x=rand();
			output<<x<<" ";
		}
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}
