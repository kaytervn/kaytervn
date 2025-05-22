#include"Prototype.h"

void ListAssignValue(LLIST &a, LLIST b) {
	a.present = b. present;
	a.head = b.head;
	a.tail = b.tail;
}

void GroupAssignValue(TabGroup &a, TabGroup b) {
	a.nTG = b.nTG;
	a.groupname = b.groupname;
	for(int i=0; i<=a.nTG; i++) {
		a.tabgroup[i].pos=i;
		ListAssignValue(a.tabgroup[i],b.tabgroup[i]);
	}
}

//ADDING
void AddTabToGroup(TabGroup &g, LLIST l) {
	g.nTG++;
	ListAssignValue(g.tabgroup[g.nTG],l);
	g.tabgroup[g.nTG].pos = g.nTG;
}

void AddGroupToTabList(TabGroup g) {
	nTL++;
	GroupAssignValue(tablist[nTL],g);
	tablist[nTL].pos= nTL;
}

//REMOVING
void DeleteTabFromGroup(TabGroup &g, LLIST l) {
	for(int i = l.pos; i<= g.nTG-1; i++) {
		g.tabgroup[i].pos = i;
		ListAssignValue(g.tabgroup[i],g.tabgroup[i+1]);
	}
	g.nTG--;
}

void DeleteGroupFromTabList(TabGroup g) {
	for(int i = g.pos; i<=nTL-1; i++) {
		tablist[i].pos=i;
		GroupAssignValue(tablist[i],tablist[i+1]);
	}
	nTL--;
}
