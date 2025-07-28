#include<bits/stdc++.h>
using namespace std;

struct Node{
	int data;
	Node *next;
};

struct LLIST{
	Node *head;
	Node *tail;
};

void xoaDau(LLIST &l)
{
	if(l.head==NULL)
		return;
	else
	{
		Node*p=l.head;
		l.head=l.head->next;
		delete p;
		if(l.head==NULL)
			l.tail=NULL;
	}
}

void khoiTao(LLIST &l)
{
	l.head=l.tail=NULL;
}

void huyLL(LLIST &l)
{
	while(l.head!=NULL)
	{
		Node *p=l.head;
		l.head=l.head->next;
		delete p;
	}
	l.tail=NULL;
}

int main()
{
	
}
