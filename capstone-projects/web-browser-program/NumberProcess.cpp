#include"Prototype.h"

void InputNumber(int &num, int dau, int cuoi) {
	cout<<"--------------------------------\n";
	string numtest;

	int int1;
	float float1;

	do {
		cout<<"Please enter a number";
		if(dau != cuoi)
			cout<<" from "<<dau<<" to "<<cuoi;
		cout<<": ";
		cin>>numtest;

		float1 = atof(numtest.c_str());
		int1 = (int)float1;

	} while(!(int1 >=dau && int1 <=cuoi && int1 == float1));

	num=int1;
}

//CHILDS
void AccessWebsite(TabGroup &g, LLIST &l, Node *p, string a) {
	AddHistory(a);

	while(p->next != NULL) {
		DeleteTail(l);
	}

	Node *q = CreateNode(a);

	AddTail(l,q);
	ShowPage(g, l, q);
}

void Exit() {
	system("cls");
	cout<<"\n\t[Browser Exited]\n";
	exit(0);
}

//MAIN
void NumberProcess(TabGroup &g, LLIST &l, Node *p, int num) {
	switch(num) {
		case 1: {
			string a;
			cout<<" => Now enter your website address: ";
			cin>>a;
			AccessWebsite(g,l,p,a);
			break;
		}

		case 2: {
			OpenNewTab();
			break;
		}

		case 3: {
			AddThisTabToGroup(g,l,p);
			break;
		}

		case 4: {
			ShowTabList();
			break;
		}

		case 5: {
			ShowHistory(g,l,p);
			break;
		}

		case 6: {
			ShowBookmark(g,l,p);
			break;
		}

		case 7: {
			CloseThisTab(g,l,p);
			break;
		}

		case 8: {
			Exit();
			break;
		}
	}
}

void NewTab_NumberProcess(TabGroup &g, LLIST &l, Node *p, int num) {
	switch(num) {
		case 9: {
			Node *q = p->next;
			ShowPage(g,l,q);
			break;
		}

		default: {
			NumberProcess(g,l,p,num);
		}
	}
}

void NextPage_NumberProcess(TabGroup &g, LLIST &l, Node *p, int num) {
	switch(num) {
		case 9: {
			Node *q = p->back;
			ShowUnknownPage(g,l,q);
			break;
		}

		case 10: {
			Node *q = p ->next;
			ShowPage(g, l, q);
			break;
		}

		default: {
			NumberProcess(g, l, p ,num);
		}
	}
}
