#include"Prototype.h"

bool ListIsEmpty(LLIST l) {
	return l.head == NULL;
}

void InitList(LLIST &l) {
	l.pos = -1;
	l.head=NULL;
	l.tail=NULL;
}

void AddHead(LLIST &l, Node *p) {
	if(l.head==NULL)
		l.head=l.tail=p;
	else {
		p->next=l.head;
		l.head->back=p;
		l.head=p;
	}
}

void AddTail(LLIST &l, Node *p) {
	if(l.head == NULL)
		l.head=p;
	else {
		p->back = l.tail;
		l.tail->next=p;
	}
	l.tail=p;
}

void DeleteHead(LLIST &l) {
	if(l.head==NULL)
		return;
	Node *p=l.head;
	l.head=l.head->next;
	l.head->back=NULL;
	p->next=NULL;
	delete p;
	if(l.head==NULL)
		l.tail=NULL;
}

void DeleteTail(LLIST &l) {
	if(l.head == l.tail)
		InitList(l);
	else {
		Node *p =l.tail;
		l.tail=l.tail->back;
		l.tail->next=NULL;
		p->back=NULL;
		delete p;
	}
}

void DeleteAfterQ(LLIST &l, Node*q) {
	if(l.head==NULL)
		return;
	else {
		Node *p = q->next;
		q->next=q->next->next;
		q->next->back=q;
		if(l.tail==p)
			l.tail=q;
		delete p;
	}
}

void DeleteList(LLIST &l) {
	while(l.head != NULL) {
		Node *p=l.head;
		l.head=l.head->next;
		l.head->back=NULL;
		delete p;
	}
	l.tail=NULL;
}

Node *CreateNode(string a) {
	Node *p = new Node;
	if(p==NULL) {
		cout<<"\n\t[Not enough memory]\n";
		return NULL;
	}
	p->address = a;
	p->back=NULL;
	p->next=NULL;
	return p;
}
