#include<bits/stdc++.h>
#define MAX 100
using namespace std;

struct Stack{
	char s[MAX];
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

void push(Stack &A, char a)
{
	if(isFull(A))
		return;
	A.top++;
	A.s[A.top] = a;
}

void pop(Stack &A)
{
	if(isEmpty(A))
		return;
	A.top--;
}

int pri(char k)
{
	switch(k)
	{
		case '(': return 1;
		case '+': return 2;
		case '-': return 2;
		case '*': return 3;
		case '/': return 3;
		case '%': return 3;
		case '^': return 4;
		default: return -1;
	}
}

void xuat(Stack A, char b[], char c)
{
	cout<<"Ky tu: "<<c<<endl;
	cout<<"Stack: ";
	for(int i=0;i<=A.top;i++)
		cout<<A.s[i];
	cout<<endl<<"Ket qua: "<<b<<endl<<endl;
}

string infixToPostfix(char s[])
{
	Stack tmp;
	InitStack(tmp);
	char kq[MAX];
	int iKQ=0;
	
	for(int i=0;i<strlen(s);i++)
	{
		if(s[i]=='(')
			push(tmp,s[i]);
		else
			if(
				(s[i]>='0') && (s[i]<='9') ||
				(s[i]>='a') && (s[i]<='z') ||
				(s[i]>='A') && (s[i]<='Z')
			)
				kq[iKQ++]=s[i];
			else
				if(s[i]==')')
				{
					while(tmp.s[tmp.top]!='(')
					{
						kq[iKQ++]=tmp.s[tmp.top];
						pop(tmp);
					}
					pop(tmp);
				}
				else
				{
					while(pri(tmp.s[tmp.top]) > pri(s[i]))
					{
						kq[iKQ++]=tmp.s[tmp.top];
						pop(tmp);
					}
					push(tmp,s[i]);
				}
//		xuat(tmp,kq,s[i]);
	}
	
	while(!isEmpty(tmp))
	{
		kq[iKQ++]=tmp.s[tmp.top];
		pop(tmp);
	}
	return (string)kq;
}

int main()
{
	Stack A;
	InitStack(A);
	char s[]="23+(14*C-(D/E)*G)*37";
	cout<<infixToPostfix(s);
//	cout<<"0.25"-'0';
	return 0;
}
