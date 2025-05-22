#include"Prototype.h"

bool AddOpenClosedTab(int &lastnum) {
	if(!StackIsEmpty(closedtab)) {
		lastnum++;
		printf("\n[%d]. Open closed ",lastnum);
		if(IsGroup(closedtab.arr[closedtab.top]))
			cout<<"Group"<<endl;
		else
			cout<<"Tab"<<endl;
		return 1;
	}
	return 0;
}

void ShowTabList() {
	system("cls");
	cout<<"\t[Tab List]\n";
	for(int i= 0; i<=nTL; i++) {
		printf("[%d]. ",i+1);
		if(IsGroup(tablist[i]))
			cout<<"[GROUP] "<<tablist[i].groupname<<endl;
		else
			cout<<tablist[i].tabgroup[0].present->address<<endl;
	}

	int lastnum=nTL+1;
	bool check = AddOpenClosedTab(lastnum);

	int num;
	InputNumber(num,1,lastnum);
	
	if(num == lastnum && check == 1) {
		TabGroup tmp;
		GroupAssignValue(tmp,Pop(closedtab));
		AddGroupToTabList(tmp);
		ShowTabList();
	} else if(IsGroup(tablist[num-1]))
		OpenGroup(tablist[num-1]);
	else
		ShowUnknownPage(tablist[num-1], tablist[num-1].tabgroup[0], tablist[num-1].tabgroup[0].present);
}
