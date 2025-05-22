#include"Prototype.h"

void ShowUnknownPage(TabGroup &g, LLIST &l, Node *p) {
	if(p -> address == "New Tab")
		ShowTab(g,l,p);
	else
		ShowPage(g,l,p);
}

void Show(LLIST &l, Node *p, int &lastnum) {
	system("cls");
	l.present = p;
	cout<<"Website Address: "<<p->address<<endl;
	cout<<"[1]. Access Website\n"
	    <<"[2]. Open New Tab\n"
	    <<"[3]. Add this Tab to Group\n"
	    <<"[4]. Open Tab List\n"
	    <<"[5]. Show History\n"
	    <<"[6]. Bookmark Controller\n"
	    <<"[7]. Close this Tab\n"
	    <<"[8]. Exit"<<endl;
	lastnum = 8;
}

void AddNext(Node *p, int &lastnum) {
	if(p->next != NULL) {
		lastnum++;
		printf("[%d]. Next",lastnum);
		cout<<endl;
	}
}

void ShowTab(TabGroup &g, LLIST &l, Node *p) {
	int num;
	int lastnum;
	Show(l,p,lastnum);
	AddNext(p,lastnum);
	InputNumber(num,1,lastnum);
	NewTab_NumberProcess(g,l,p,num);
}

void ShowPage(TabGroup &g, LLIST &l, Node *p) {
	int num;
	int lastnum;
	Show(l,p,lastnum);
	lastnum++;
	printf("[%d]. Back",lastnum);
	cout<<endl;
	AddNext(p,lastnum);
	InputNumber(num,1,lastnum);
	NextPage_NumberProcess(g,l,p,num);
}
