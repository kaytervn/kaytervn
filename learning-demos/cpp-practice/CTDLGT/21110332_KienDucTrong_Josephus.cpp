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

void themCuoi(LLIST &l, Node*p)
{
	if(l.head == NULL)
		l.head=p;
	else
		l.tail->next=p;
	l.tail=p;
}

void khoiTao(LLIST &l)
{
	l.head=l.tail=NULL;
}

Node *taoNode(int x)
{
	Node*p=new Node;
	p->data=x;
	p->next=NULL;
	return p;
}

void nhapNode(LLIST &l, int x)
{
	Node*p=taoNode(x);
	themCuoi(l,p);
}

void xuat(LLIST l)
{
	for(Node *p=l.head;p!=NULL;p=p->next)
	{
		cout<<p->data<<setw(4);
	}
	cout<<endl<<endl;
}

Node* timX(LLIST l, int x)
{
	Node *p=l.head;
	while(p!=NULL && p->data!=x)
		p=p->next;
	return p;
}

int demNode(LLIST l)
{
	int dem =0;
	for(Node*p=l.head;p!=NULL;p=p->next)
		if(p->data>0)
			dem++;
	return dem;
}

void play(LLIST l, Node *pos)
{
	int dem=0;
	Node *p=pos;
	int i=0;
	while(true)
	{
		if(p->data!=0)
			dem++;

		if(dem==3)
		{
			p->data=0;
			dem=0;
		}
		p=p->next;
		if(p==NULL)
		{
			cout<<"VONG CHOI THU "<<i+1<<": \n";
			xuat(l);
			i++;
			if(demNode(l)==2)
				break;
			p=l.head;
		}
			
	}
}

int main()
{
	LLIST l;
	khoiTao(l);
	int n=18;
	int m=1;
	
	for(int i=1;i<=n;i++)
		nhapNode(l,i);
		
	Node *pos=timX(l,m);
	
	cout<<"BAN DAU: \n*Bat dau dem tai phan tu co gia tri la "<<m<<"*\n";
	xuat(l);
	
	play(l,pos);
}
