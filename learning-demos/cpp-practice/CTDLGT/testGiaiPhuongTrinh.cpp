#include<bits/stdc++.h>
using namespace std;

struct Node{
	int hs;
	int mu;
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

Node *taoNode(int x, int y)
{
	Node*p=new Node;
	p->hs=x;
	p->mu=y;
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

void nhapNode(LLIST &l, int x, int y)
{
	Node*p=taoNode(x,y);
	themCuoi(l,p);
}

void xuat(LLIST l)
{
	for(Node*p=l.head;p!=NULL;p=p->next)
	{
		if(p->hs > 0 && p!=l.head)
			cout<<" +";
		cout<<p->hs<<"x^"<<p->mu<<" ";
	}
	cout<<"= ";
}

int tinh(LLIST l, int x)
{
	int kq=0;
	for(Node*p=l.head;p!=NULL;p=p->next)
	{
		kq += p->hs*pow(x,p->mu);
	}
	return kq;
}

int main()
{
	LLIST l;
	nhapNode(l,4,6);
	nhapNode(l,-9,5);
	nhapNode(l,8,4);
	nhapNode(l,-4,3);
	nhapNode(l,2,0);
	xuat(l);
	
	cout<<tinh(l,2);
}
