#include<bits/stdc++.h>
#define MAX 100
using namespace std;

struct Stack{
	char s[MAX][MAX];
	int top;
};

void InitStack(Stack &A)
{
	A.top=-1;
}

bool isEmpty(Stack A)
{
	return A.top==-1;
}

bool isFull(Stack A)
{
	return A.top == MAX-1;
}

void push(Stack &A, char a[])
{
	if(isFull(A))
		return;
	A.top++;
	strcpy(A.s[A.top],a);
}

void pop(Stack &A)
{
	if(isEmpty(A))
		return;
	A.top--;
}

int pri(char k[])
{
	if(strcmp(k,"+") == 0 || strcmp(k,"-") == 0)
		return 2;
	if(strcmp(k,"*") == 0 || strcmp(k,"/") == 0 || strcmp(k,"%") == 0)
		return 3;
	if(strcmp(k,"^") == 0)
		return 4;
	return -1;
}

void infixToPostfix(char s[], char kq[][MAX], int &iKQ)
{
	Stack st;
	InitStack(st);
	
	int count=0;
	stringstream ss(s);
	char tmp[MAX][MAX];
	while(ss>>tmp[count])
	{
		count++;
	}
		
	for(int i=0;i<count;i++)
	{
		if(strcmp(tmp[i],"(") == 0)
			push(st,tmp[i]);
		else if(pri(tmp[i]) != -1)
			{
				while(pri(st.s[st.top]) > pri(tmp[i]))
				{
					strcpy(kq[iKQ++],st.s[st.top]);
					pop(st);
				}
				push(st,tmp[i]);
			}
			else
				if(strcmp(tmp[i],")") == 0)
				{
					while(strcmp(st.s[st.top],"(") != 0)
					{
						strcpy(kq[iKQ++],st.s[st.top]);
						pop(st);
					}
					pop(st);
				}
				else
				{
					strcpy(kq[iKQ++],tmp[i]);
				}
	}
	
	while(!isEmpty(st))
	{
		strcpy(kq[iKQ++],st.s[st.top]);
		pop(st);
	}
}

int evaluatePostfix(char t[][MAX], int it)
{
	Stack st;
	InitStack(st);
		
	for(int i=0;i<it;i++)
	{
		if(pri(t[i]) != -1)
		{
			int a = atoi(st.s[st.top]);
			pop(st);
				
			int b = atoi(st.s[st.top]);
			pop(st);
			
			char kq[MAX];
						
			if(strcmp(t[i],"+") == 0)
				itoa(b+a,kq,10);
			
			if(strcmp(t[i],"-") == 0)
				itoa(b-a,kq,10);
			
			if(strcmp(t[i],"*") == 0)
				itoa(b*a,kq,10);
			
			if(strcmp(t[i],"/") == 0)
				itoa(b/a,kq,10);
			
			if(strcmp(t[i],"%") == 0)
				itoa(b%a,kq,10);
			
			if(strcmp(t[i],"^") == 0)
				itoa(pow(b,a),kq,10);

			push(st,kq);
		}
		else
			push(st,t[i]);
	}
	return atoi(st.s[0]);
}

void reverse(char kq[][MAX], int iKQ)
{
	int x=0;
	int y=iKQ-1;
	while(x<y)
	{
		char tmp[MAX];
		strcpy(tmp,kq[x]);
		strcpy(kq[x],kq[y]);
		strcpy(kq[y],tmp);
		x++;
		y--;
	}
}

void infixToPrefix(char s[], char kq[][MAX], int &iKQ)
{
	Stack st;
	InitStack(st);
	
	int count=0;
	stringstream ss(s);
	char tmp[MAX][MAX];
	while(ss>>tmp[count])
	{
		count++;
	}
		
	for(int i=count-1;i>=0;i--)
	{
		if(strcmp(tmp[i],")") == 0)
			push(st,tmp[i]);
		else if(pri(tmp[i]) != -1)
			{
				while(pri(st.s[st.top]) > pri(tmp[i]))
				{
					strcpy(kq[iKQ++],st.s[st.top]);
					pop(st);
				}
				push(st,tmp[i]);
			}
			else
				if(strcmp(tmp[i],"(") == 0)
				{
					while(strcmp(st.s[st.top],")") != 0)
					{
						strcpy(kq[iKQ++],st.s[st.top]);
						pop(st);
					}
					pop(st);
				}
				else
				{
					strcpy(kq[iKQ++],tmp[i]);
				}
	}
	
	while(!isEmpty(st))
	{
		strcpy(kq[iKQ++],st.s[st.top]);
		pop(st);
	}
	
	reverse(kq,iKQ);
}

int evaluatePrefix(char t[][MAX], int it)
{
	Stack st;
	InitStack(st);
	
	for(int i=it-1;i>=0;i--)
	{
		if(pri(t[i]) != -1)
		{
			int a = atoi(st.s[st.top]);
			pop(st);
				
			int b = atoi(st.s[st.top]);
			pop(st);
			
			char kq[MAX];
						
			if(strcmp(t[i],"+") == 0)
				itoa(a+b,kq,10);
			
			if(strcmp(t[i],"-") == 0)
				itoa(a-b,kq,10);
			
			if(strcmp(t[i],"*") == 0)
				itoa(a*b,kq,10);
			
			if(strcmp(t[i],"/") == 0)
				itoa(a/b,kq,10);
			
			if(strcmp(t[i],"%") == 0)
				itoa(a%b,kq,10);
			
			if(strcmp(t[i],"^") == 0)
				itoa(pow(a,b),kq,10);

			push(st,kq);
		}
		else
			push(st,t[i]);
	}
	return atoi(st.s[0]);
}

int main()
{
	Stack A;
	InitStack(A);
	char s1[]="A + ( B * C - ( D / E ) * G ) * H";
	char s2[]="32 + ( 15 ^ 2 - ( 8 / 4 ) * 2 ) * 3";
	
	//Test 1
	char kq1[MAX][MAX];
	int iKQ1=0;
	infixToPostfix(s1,kq1,iKQ1);
	
	for(int i=0;i<iKQ1;i++)
		cout<<kq1[i]<<" ";
	cout<<endl;
	
	//Test 2
	char kq2[MAX][MAX];
	int iKQ2=0;
	infixToPostfix(s2,kq2,iKQ2);
	
	for(int i=0;i<iKQ2;i++)
		cout<<kq2[i]<<" ";
	cout<<endl;
	
	cout<<evaluatePostfix(kq2,iKQ2)<<endl;
	
	//Test 3
	char kq3[MAX][MAX];
	int iKQ3=0;
	infixToPrefix(s1,kq3,iKQ3);
	
	for(int i=0;i<iKQ3;i++)
		cout<<kq3[i]<<" ";
	cout<<endl;

	//Test 4
	char kq4[MAX][MAX];
	int iKQ4=0;
	infixToPrefix(s2,kq4,iKQ4);
	
	for(int i=0;i<iKQ4;i++)
		cout<<kq4[i]<<" ";
	cout<<endl;
	
	cout<<evaluatePrefix(kq4,iKQ4)<<endl;
	return 0;
}
