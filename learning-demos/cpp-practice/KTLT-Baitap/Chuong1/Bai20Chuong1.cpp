#include<iostream>
#include<fstream>
#include<ctime>
#include<cstdlib>
using namespace std;

void taoFileNNkhongTrung();

int main()
{
	taoFileNNkhongTrung();
	return 0;
}

void taoFileNNkhongTrung()
{
	fstream output;
	output.open("SONGUYEN1.INP", ios::out);
	
	if(output)
	{
		srand((unsigned)time (NULL));
		
		int n,d;
		d=0;
		n=10000;
		int B[32767]={0};
		
		while(d<n)
		{
			int x= 1+ rand()%32766;
			if(B[x]==0)
			{
				B[x]=1;
				d++;
				output<<x<<" ";
			}
		}
		
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}
