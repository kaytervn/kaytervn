#include"Prototype.h"

void ShowCurrentTab(TabGroup g, LLIST l, Node *p) {
	if(IsGroup(g)) {
		printf("[GROUP] [P%d]. ",g.pos+1);
		cout<<g.groupname<<endl;
		cout<<"Current Tab: ";
		printf("[P%d]. ",l.pos+1);
		cout<<p->address<<endl;
	} else {
		cout<<"Current Tab: ";
		printf("[P%d]. ",g.pos+1);
		cout<<p->address<<endl;
	}
}

void AddThisTabToAvailableGroup(TabGroup &g, LLIST &l, Node *p) {
	int dem = 0;
	int vt[nTL];
	ShowGroupList(dem,vt);
	int num;
	InputNumber(num,1,dem);

	if(vt[num] != g.pos) {
		AddTabToGroup(tablist[vt[num]],l);
		DeleteGroupFromTabList(g);
	}
	ShowTabList();
}

void MoveThisTabOutOfGroup(TabGroup &g, LLIST l) {
	TabGroup tmp;
	InitTabGroup(tmp);
	AddTabToGroup(tmp,l);
	AddGroupToTabList(tmp);
	DeleteTabFromGroup(g,l);
	ShowTabList();
}

//MAIN
void AddThisTabToGroup(TabGroup &g, LLIST &l, Node *p) {
	system("cls");
	ShowCurrentTab(g,l,p);
	cout<<"\n\t[Group Controller]\n"
	    <<"[1]. Back\n";
	if(!IsGroup(g)) {
		cout<<"[2]. Add this Tab to New Group\n";
		int lastnum = 2;
		if(GroupCount() > 0) {
			lastnum++;
			cout<<"[3]. Move this Tab to available Group\n";
		}
		int num;
		InputNumber(num,1,lastnum);

		if(num == 1)
			ShowUnknownPage(g,l,p);
		else if(num == 2)
			CreateNewGroup(g);
		else {
			AddThisTabToAvailableGroup(g,l,p);
		}
	} else {
		cout<<"[2]. Move this Tab out of group\n"
		    <<"[3]. Move this Tab to available Group"<<endl;

		int num;
		InputNumber(num,1,3);

		if(num == 1)
			ShowUnknownPage(g,l,p);
		if(g.nTG == 0) {
			if (num == 2) {
				UnGroup(g);
				ShowTabList();
			} else {
				AddThisTabToAvailableGroup(g,l,p);
			}
		} else {
			if (num == 2) {
				MoveThisTabOutOfGroup(g,l);
			} else {
				int dem = 0;
				int vt[nTL];
				ShowGroupList(dem,vt);
				int num;
				InputNumber(num,1,dem);

				if(vt[num] != g.pos) {
					DeleteTabFromGroup(g,l);
					AddTabToGroup(tablist[vt[num]],l);
				}
				ShowTabList();
			}
		}
	}
}
