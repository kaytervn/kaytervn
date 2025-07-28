#include<iostream>
#include<cstring>
#define SIZE 100
using namespace std;
bool ktDoiXung();

char A[SIZE],B[SIZE];

int main()
{
	cin.getline(A,SIZE);
	cout<<ktDoiXung();
	
	return 0;
}

bool ktDoiXung()
{
	strcpy(B,A);
	strrev(B);
	if(stricmp(A,B)==0)
		return 1;
	else
		return 0;
}
