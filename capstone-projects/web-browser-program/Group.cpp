#include"Prototype.h"

void InitTabGroup(TabGroup &g) {
	g.groupname = "";
	g.nTG = -1;
	g.pos = -1;
}

bool IsGroup(TabGroup g) {
	return (g.groupname != "");
}

void UnGroup(TabGroup &g) {
	g.groupname = "";
}

bool GroupIsFull(TabGroup g) {
	return (g.nTG == MAX - 1);
}

void CreateNewGroup(TabGroup &g) {
	string a;
	cout<<" => Now enter a new group name: ";
	cin>>a;
	g.groupname = a;
	OpenGroup(g);
}

void DeleteGroup(TabGroup &g) {
	for(int i=0; i<=g.nTG; i++) {
		DeleteList(g.tabgroup[i]);
	}
}

int GroupCount() {
	int dem=0;
	for(int i= 0 ; i <= nTL; i++)
		if(tablist[i].groupname != "")
			dem++;
	return dem;
}

void ShowGroupList(int &dem, int vt[]) {
	system("cls");
	cout<<"\t[Group List]\n";
	for(int i = 0; i<= nTL; i++) {
		if(IsGroup(tablist[i])) {
			dem++;
			vt[dem]=i;
			printf("[%d]. ",dem);
			cout<<"[GROUP] "<<tablist[i].groupname<<endl;
		}
	}
}

void CloseGroup(TabGroup &g) {
	if(nTL == 0) {
		Exit();
	} else {
		Push(closedtab, g);
		DeleteGroupFromTabList(g);
		ShowTabList();
	}
}

void OpenGroup(TabGroup &g) {
	system("cls");
	printf("[GROUP] [P%d]. ",g.pos+1);
	cout<<g.groupname<<endl;

	for(int i= 0; i<=g.nTG; i++) {
		printf("[%d]. ",i+1);
		cout<<g.tabgroup[i].present->address<<endl;
	}

	int o1 = g.nTG + 2;
	int o2 = o1 + 1;
	int o3 = o2 + 1;

	printf("\n[%d]. ",o1);
	cout<<"Change Group Name\n";

	printf("[%d]. ",o2);
	cout<<"Close Group\n";

	printf("[%d]. ",o3);
	cout<<"Back to Tab List\n";

	int num;
	InputNumber(num,1,o3);

	if(num == o1) {
		string a;
		cout<<" => Now enter a new group name: ";
		cin>>a;
		g.groupname = a;
		OpenGroup(g);
	} else if(num == o2) {
		CloseGroup(g);
	} else if(num == o3)
		ShowTabList();
	else
		ShowUnknownPage(g,g.tabgroup[num-1],g.tabgroup[num-1].present);
}
