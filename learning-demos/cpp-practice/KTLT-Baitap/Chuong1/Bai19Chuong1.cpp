#include<iostream>
#include<fstream>
#include<ctime>
#include<cstdlib>
using namespace std;

void docFile(int A[], int &n);
void taoFile();
void xuatFile(int A[], int n);
void hoanVi(int &a, int &b);
void xepTangDan(int A[], int n);

int main()
{
	int A[10000],n;
	n=0;
	
	taoFile();
	docFile(A,n);
	xepTangDan(A,n);
	xuatFile(A,n);
	
	return 0;
}

void docFile(int A[], int &n)
{
	fstream input;
	input.open("SONGUYEN.INP", ios::in|ios::binary);
	
	if(input)
	{
		while(true)
		{
			int B[10];
			input.read(reinterpret_cast<char *>(&B),sizeof(B));
			char c;
			input.read(reinterpret_cast<char *>(&c),sizeof(c));
			
			if(input.eof())
				break;
			
			for(int i=0;i<10;i++)
				A[n++]=B[i];
		}
		input.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void taoFile()
{
	fstream output;
	output.open("SONGUYEN.INP", ios::out|ios::binary);
	if(output)
	{
		srand((unsigned)time (NULL));
		int A[10];
		int n=1000;
		for(int i=0;i<n;i++)
		{
			for(int j=0;j<10;j++)
			{
				A[j]=rand();
//				cout<<A[j]<<" ";
			}
			output.write(reinterpret_cast<char *>(&A),sizeof(A));
			output.write("\n",1);
//			cout<<endl;
		}
	
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void xuatFile(int A[], int n)
{
	fstream output;
	output.open("SONGUYEN.OUT", ios::out|ios::binary);
	if(output)
	{
//		cout<<"--------------------\n";
		int B[10];
		int i=0;
		while(i<n)
		{
			for(int j=0;j<10;j++)
			{
				B[j]=A[i++];
//				cout<<B[j]<<" ";
			}
			output.write(reinterpret_cast<char *>(&B),sizeof(B));
			output.write("\n",1);
//			cout<<endl;
		}
	
		output.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void hoanVi(int &a, int &b)
{
	long tmp=a;
	a=b;
	b=tmp;
}

void xepTangDan(int A[], int n)
{
	for(int i=0;i<n-1;i++)
		for(int j=i+1;j<n;j++)
			if(A[i]>A[j])
				hoanVi(A[i],A[j]);
}
