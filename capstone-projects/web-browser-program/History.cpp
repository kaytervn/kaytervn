#include"Prototype.h"

void AddHistory(string a) {
	for(int i= nH+1; i>=1 ; i--) {
		history[i].pos = i;
		history[i].address = history[i-1].address;
	}
	nH++;
	history[0].address = a;
	History_WriteDataToFile();
}

void DeleteHistory(int pos) {
	for(int i = pos; i<= nH-1; i++) {
		history[i].pos = i;
		history[i].address = history[i+1].address;
	}
	nH--;
	History_WriteDataToFile();
}

void ShowHistoryOption(TabGroup &g, LLIST &l, Node *p, int pos) {
	system("cls");
	cout<<"You chose ";
	printf("[P%d]. ", pos+1);
	cout<<history[pos].address<<endl;

	cout<<"[1]. Access this Address\n";
	cout<<"[2]. Delete this Address\n";
	cout<<"[3]. Back\n";
	int num;
	InputNumber(num,1,3);
	if(num == 1) {
		AccessWebsite(g,l,p,history[pos].address);
	} else if(num == 2) {
		string a;
		do
		{
			cout<<" => Delete this Address? (Y/N): ";
			cin>>a;
			if(toupper(a[0]) == 'Y')
			{
				DeleteHistory(pos);
				ShowHistory(g,l,p);
			}
			else if(toupper(a[0]) == 'N')
			{
				ShowHistoryOption(g,l,p,pos);
			}
		} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));

	} else
		ShowHistory(g,l,p);
}

void SearchHistory(TabGroup &g, LLIST &l, Node *p)
{
	system("cls");
	ShowCurrentTab(g,l,p);
	string a;
	cout<<"\n => Searching History Bar: ";
	cin>>a;
	
	int dem=0;
	int vt[nH];
	bool mark = 0;
	
	cout<<"\n\t[History]\n";
	
	for(int i=0; i<=nH; i++)
	{
		if(history[i].address.find(a) != std::string::npos)
		{
			dem++;
			vt[dem] = i;
			printf("[%d]. ", dem);
			cout<<history[i].address<<endl;
			mark = 1;
		}
	}
	
	if(mark == 0)
	{
		dem = -1;
		cout<<"\n\tNo search results\n";
	}
	
	int o1= dem+2;
	int o2 = o1+1;
	
	printf("\n[%d]. Search again\n", o1);
	printf("[%d]. Back\n", o2);
	
	int num;
	InputNumber(num,1,o2);
	
	if(num == o1)
		SearchHistory(g,l,p);
	else if(num == o2)
	{
		ShowHistory(g,l,p);
	}
	else
		ShowHistoryOption(g,l,p,vt[num]);
}

void ShowHistory(TabGroup &g, LLIST &l, Node *p) {
	int num;
	system("cls");
	ShowCurrentTab(g,l,p);
	cout<<"\n\t[History]\n";

	if(nH >= 0) {
		for(int i=0; i<=nH ; i++) {
			printf("[%d]. ",i+1);
			cout<<history[i].address<<endl;
		}
		int o1 = nH+2;
		int o2 = o1+1;
		int o3 = o2+1;

		printf("\n[%d]. Search History\n",o1);
		printf("[%d]. Delete all Address\n",o2);
		printf("[%d]. Back\n",o3);

		InputNumber(num,1,o3);
		int pos = num-1;

		if(num == o1)
		{
			SearchHistory(g,l,p);
		}
		else if(num == o2) {
			string a;
			do
			{
				cout<<" => Delete all Address? (Y/N): ";
				cin>>a;
				if(toupper(a[0]) == 'Y')
				{
					nH = -1;
					History_WriteDataToFile();
					ShowHistory(g,l,p);
				}
				else if(toupper(a[0]) == 'N')
				{
					ShowHistory(g,l,p);
				}
			} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));
		} else if(num == o3) {
			ShowUnknownPage(g,l,p);
		} else
			ShowHistoryOption(g,l,p,pos);
	} else {
		cout<<"\n\tNo History\n";
		printf("\n[1]. Back\n");
		InputNumber(num,1,1);
		ShowUnknownPage(g,l,p);
	}
}
