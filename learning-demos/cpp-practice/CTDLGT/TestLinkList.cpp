#include<bits/stdc++.h>
using namespace std;

struct Node{
	int data;
	Node*next;
};

struct LL{
	Node*head;
	Node*tail;
};

void khoiTao(LL &l)
{
	l.head=l.tail=NULL;
}

Node*taoNode(int x)
{
	Node*p=new Node();
	p->data=x;
	p->next=NULL;
	return p;
}

int main()
{
	LL l;
	int A[10];
	for(int i=0;i<10;i++){
		A[i]=i+1;
	}
	khoiTao(l);
	for(Node*p=l.head;p!=NULL;p=p->next)
	{
		Node*tmp=new Node;
	}
}
