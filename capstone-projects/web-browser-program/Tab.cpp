#include"Prototype.h"

void OpenNewTab() {
	TabGroup g;
	InitTabGroup(g);

	LLIST l;
	InitList(l);

	Node *p = CreateNode("New Tab");
	AddTail(l,p);
	l.present=p;

	AddTabToGroup(g,l);
	AddGroupToTabList(g);
	ShowTab(tablist[nTL], tablist[nTL].tabgroup[0], tablist[nTL].tabgroup[0].present);
}

void CloseThisTab(TabGroup &g, LLIST &l, Node *p) {
	if(!IsGroup(g)) {
		if(nTL == 0) {
			Exit();
		} else {
			Push(closedtab,g);
			DeleteGroupFromTabList(g);
			ShowTabList();
		}
	} else {
		if(g.nTG == 0) {
			Push(closedtab,g);
			DeleteGroupFromTabList(g);
		} else {
			TabGroup tmp;
			InitTabGroup(tmp);
			AddTabToGroup(tmp,l);

			Push(closedtab,tmp);
			DeleteTabFromGroup(g,l);
		}
		ShowTabList();
	}
}
