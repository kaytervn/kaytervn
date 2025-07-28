#include<bits/stdc++.h>
#include<fstream>
using namespace std;

struct SV{
	char name[51];
	char MSSV[4];
	double diem;
};

struct NODE{
	SV data;
	NODE *next;
};

struct LLIST{
	NODE *head;
	NODE *tail; 
};

void xuat(LLIST l);
void khoiTao(LLIST &l);
NODE *taoNode(SV x);
void themCuoi(LLIST &l, NODE*p);
void docFile(LLIST &l);
void docDS(SV &x, fstream &input);
void xoaDau(LLIST &l);
void xoaSauQ(LLIST &l, NODE *q);
void xoaCuoi(LLIST &l);
void loaiSVduoi5(LLIST &l);
void sapXep(LLIST &l);
void xoaGiua(LLIST &l, int pos);
double timMax(LLIST &l);
double timMin(LLIST &l);
void caoDungDau(LLIST &l);
void thapDungCuoi(LLIST &l);

int main()
{
	LLIST l;
	khoiTao(l);
	docFile(l);
	
	cout<<"\t\tDANH SACH SV BAN DAU: \n\n";
	xuat(l);
	cout<<"\t\t   ***===****===***===***===***\n\n";
	
	cout<<"\t\tDANH SACH SV SAU KHI DA THUC HIEN: \n\n"
	<<"\t1. Loai SV co diem CTDLGT duoi 5.0 ra khoi DS.\n"
	<<"\t2. SV co diem CTDLGT cao nhat dung dau DS.\n"
	<<"\t3. SV co diem CTDLGT thap nhat dung cuoi DS.\n\n";
//	sapXep(l);
	loaiSVduoi5(l);
	caoDungDau(l);
	thapDungCuoi(l);
	xuat(l);
	return 0;
}

double timMax(LLIST &l)
{
	double max=l.head->data.diem;
	for(NODE*p=l.head->next;p!=NULL;p=p->next)
	{
		if(p->data.diem > max)
		{
			max=p->data.diem;
		}
	}
	return max;
}

double timMin(LLIST &l)
{
	double min=l.head->data.diem;
	for(NODE*p=l.head->next;p!=NULL;p=p->next)
	{
		if(p->data.diem < min)
		{
			min=p->data.diem;
		}
	}
	return min;
}

void caoDungDau(LLIST &l)
{
	if(l.head->data.diem == timMax(l))
		return;
	for(NODE*p=l.head->next;p!=NULL;p=p->next)
	{
		if(p->data.diem == timMax(l))
		{
			SV x = l.head->data;
			l.head->data = p->data;
			p->data=x;
			if(p==l.tail)
				l.tail->data=x;
		}
	}
}

void thapDungCuoi(LLIST &l)
{
	if(l.tail->data.diem == timMin(l))
		return;
	for(NODE*p=l.head->next;p!=NULL;p=p->next)
	{
		if(p->data.diem == timMin(l))
		{
			SV x = l.tail->data;
			l.tail->data = p->data;
			p->data=x;
			if(p==l.head)
				l.head->data=x;
		}
	}
}

void xoaGiua(LLIST &l, int pos)
{
	if(pos==0)
		xoaDau(l);
	else
		if(pos==sizeof(l)-1)
			xoaCuoi(l);
		else
		{
			NODE *truoc= NULL;
			NODE *sau=l.head;
			
			for(int i=1;i<=pos;i++)
			{
				truoc=sau;
				sau=sau->next;
			}
			if(truoc==NULL)
			{
				l.head=l.tail=NULL;
			}
			else
			{
				truoc->next=sau->next;
				delete sau;
			}
		}
}

void loaiSVduoi5(LLIST &l)
{
	int i=0;
	for(NODE*p=l.head;p!=NULL;p=p->next)
	{
		if(p->data.diem < 5.0)
		{
			xoaGiua(l,i);
			i--;
		}
		i++;
	}
}

void sapXep(LLIST &l)
{
	for(NODE*p=l.head;p!=l.tail;p=p->next)
	{
		for(NODE*q=p->next;q!=NULL;q=q->next)
		{
			if(p->data.diem < q->data.diem)
			{
				SV x = p->data;
				p->data = q->data;
				q->data=x;
			}
		}
		
	}
}

void xoaDau(LLIST &l)
{
	if(l.head==NULL)
		return;
	else
	{
		NODE*p=l.head;
		l.head=l.head->next;
		delete p;
		if(l.head==NULL)
			l.tail=NULL;
	}
}

void xoaCuoi(LLIST &l)
{
	for(NODE*k=l.head;k!=NULL;k=k->next)
	{
		if(k->next==l.tail)
		{
			delete l.tail;
			k->next=NULL;
			l.tail=k;
		}
	}
}

void xoaSauQ(LLIST &l, NODE *q)
{
	if(l.head==NULL||q->next==NULL)
		return;
	else
	{
		NODE*p=q->next;
		q->next=q->next->next;
		if(l.tail==p)
			l.tail=q;
		delete p;
	}
}

void xuat(LLIST l)
{
	for(NODE *p=l.head;p!=NULL;p=p->next)
	{
		cout<<"Ten SV: "<<p->data.name
		<<"\nMSSV: "<<p->data.MSSV
		<<"\nDiem mon CTDLGT: "<<p->data.diem<<endl<<endl;
	}
}

void khoiTao(LLIST &l)
{
	l.head=NULL;
	l.tail=NULL;
}

NODE *taoNode(SV x)
{
	NODE *p=new NODE();
	if(p==NULL)
	{
		cout<<"\nKhong du bo nho!";
		return NULL;
	}
	p->data=x;
	p->next=NULL;
	return p;
}

void themCuoi(LLIST &l, NODE*p)
{
	if(l.head == NULL)
		l.head=p;
	else
		l.tail->next=p;
	l.tail=p;
}

void docFile(LLIST &l)
{
	fstream input;
	input.open("DANHSACH.txt", ios::in);
	
	if(input!=NULL)
	{
		int n;
		input>>n;
		for(int i=0;i<n;i++)
		{
			SV x;
			docDS(x,input);
			NODE *p= new NODE;
			p=taoNode(x);
			themCuoi(l,p);
		}
		input.close();
	}
	else
	{
		cout<<"Khong mo duoc!";
		exit(0);
	}
}

void docDS(SV &x, fstream &input)
{
	input.ignore();
	input.getline(x.name,51);
	input.getline(x.MSSV,4);
	input>>x.diem;
}
