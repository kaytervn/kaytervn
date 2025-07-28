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

void khoiTao(LLIST &l)
{
	l.head=l.tail=NULL;
}

void xoaSauQ(LLIST &l, Node *q)
{
	if(l.head==NULL||q->next==NULL)
		return;
	else
	{
		Node*p=q->next;
		q->next=q->next->next;
		if(l.tail==p)
			l.tail=q;
		delete p;
	}
}

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

void xoaX(LLIST &l, int x)
{
	Node *truoc=NULL;
	Node *sau=l.head;
	
	while(sau!= NULL && sau->data!=x)
	{
		truoc=sau;
		sau=sau->next;
	}
	
	if(sau == NULL)
		return;
	if(truoc == NULL)
		xoaDau(l);
	else
		xoaSauQ(l,sau);
		
}

Node *taoNode(int x)
{
	Node*p=new Node;
	p->data=x;
	p->next=NULL;
	return p;
}

void themCuoi(LLIST &l, Node*p)
{
	if(l.head == NULL)
		l.head=p;
	else
		l.tail->next=p;
	l.tail=p;
}

void xuat(LLIST l)
{
	for(Node*p=l.head;p!=NULL;p=p->next)
	{
		cout<<p->data<<" ";
	}
}

Node *timNodeTruocTail(LLIST l)
{
	for(Node*k=l.head;k!=NULL;k=k->next)
	{
		if(k->next==l.tail)
			return k;
	}
}

void xoaCuoi(LLIST &l)
{
	if(l.head==NULL)
		return;
	if(l.head==l.tail)
		l.head=l.tail=NULL;
	else
	{
		for(Node*k=l.head;k!=NULL;k=k->next)
		{
			if(k->next==l.tail)
			{
				delete l.tail;
				k->next=NULL;
				l.tail=k;
			}
		}
	}
}

int main()
{
	LLIST l;
	khoiTao(l);
	int n=10;
	for(int i=0;i<n;i++)
	{
		Node*p=taoNode(i);
		themCuoi(l,p);
	}
	xuat(l);
	
//	Node *tmp=timNodeTruocTail(l);
//	cout<<endl<<tmp->data;
	
//	int x=11;
//	xoaX(l,x);
//	cout<<endl;
//	xuat(l);
}
