#include"Prototype.h"

void InitBookmark(Bookmark &a) {
	a.pos = -1;
	a.nBM = -1;
	a.foldername = "";
}

void UnFolder(Bookmark &bm) {
	bm.foldername = "";
}

void BookmarkAssignValue(Bookmark &a, Bookmark b) {
	a.nBM = b.nBM;
	a.foldername = b.foldername;
	for(int i=0; i<= a.nBM; i++) {
		a.address[i].pos = i;
		a.address[i].address = b.address[i].address;
	}
}

void AddAddressToFolder(Bookmark &bm, string address) {
	bm.nBM++;
	bm.address[bm.nBM].address = address;
	bm.address[bm.nBM].pos = bm.nBM;
	Bookmark_WriteDataToFile();
}

void AddFolderToBookmark(Bookmark bm) {
	nBM++;
	BookmarkAssignValue(bookmark[nBM], bm);
	bookmark[nBM].pos = nBM;
	Bookmark_WriteDataToFile();
}

void DeleteAddressFromFolder(Bookmark &bm, History a) {
	for(int i = a.pos; i<= bm.nBM-1; i++) {
		bm.address[i].pos = i;
		bm.address[i].address = bm.address[i+1].address;
	}
	bm.nBM--;
	Bookmark_WriteDataToFile();
}

void DeleteFolderFromBookmark(Bookmark bm) {
	for(int i = bm.pos; i<=nBM-1; i++) {
		bookmark[i].pos = i;
		BookmarkAssignValue(bookmark[i], bookmark[i+1]);
	}
	nBM--;
	Bookmark_WriteDataToFile();
}

void CreateNewFolder(Bookmark &bm) {
	string a;
	cout<<" => Now enter a new folder name: ";
	cin>>a;
	bm.foldername = a;
	Bookmark_WriteDataToFile();
}

bool IsFolder(Bookmark a) {
	return a.foldername != "";
}

void ShowCurrentBookmark(Bookmark bm, History ad) {
	if(IsFolder(bm)) {
		printf("[FOLDER] [P%d]. ",bm.pos+1);
		cout<<bm.foldername<<endl;
		cout<<"Current Bookmark Address: ";
		printf("[P%d]. ",ad.pos+1);
		cout<<ad.address<<endl;
	} else {
		cout<<"Current Bookmark Address: ";
		printf("[P%d]. ",bm.pos+1);
		cout<<ad.address<<endl;
	}
}

int FolderCount() {
	int dem=0;
	for(int i= 0 ; i <= nBM; i++)
		if(bookmark[i].foldername != "")
			dem++;
	return dem;
}

void MoveToAvailFolder_Address(Bookmark bm, History ad) {
	int dem = 0;
	int vt[nTL];
	ShowFolderList(dem,vt);
	int num;
	InputNumber(num,1,dem);

	if(vt[num] != bm.pos) {
		AddAddressToFolder(bookmark[vt[num]],ad.address);
		DeleteFolderFromBookmark(bm);
	}
	Bookmark_WriteDataToFile();
}

void MoveToAvailFolder_Folder(Bookmark &bm, History ad) {
	int dem = 0;
	int vt[nTL];
	ShowFolderList(dem,vt);
	int num;
	InputNumber(num,1,dem);

	if(vt[num] != bm.pos) {
		DeleteAddressFromFolder(bm,ad);
		AddAddressToFolder(bookmark[vt[num]], ad.address);
	}
	Bookmark_WriteDataToFile();
}

void MoveAddressOutOfFolder(Bookmark &bm, History ad) {
	BookmarkThisTab(ad.address);
	DeleteAddressFromFolder(bm,ad);
	Bookmark_WriteDataToFile();
}

void OpenBookmarkAddress(Bookmark &bm, History &ad, TabGroup &g, LLIST &l, Node *p) {
	int num;
	system("cls");
	ShowCurrentTab(g,l,p);
	cout<<"--------------------------------\n";
	ShowCurrentBookmark(bm,ad);

	cout<<"[1]. Access this Bookmark address";
	cout<<"\n[2]. Delete this Bookmark address";
	if(!IsFolder(bm)) {
		if(FolderCount() > 0) {
			cout<<"\n[3]. Add this Bookmark address to new Folder";
			cout<<"\n[4]. Move this Bookmark address to available Folder";
			cout<<"\n[5]. Back\n";
			InputNumber(num, 1,5);

			if(num == 1) {
				AccessWebsite(g,l,p,ad.address);
			} else if(num == 2) {
				string a;
				do {
					cout<<" => Delete this Bookmark address? (Y/N): ";
					cin>>a;
					if(toupper(a[0]) == 'Y') {
						if(bm.nBM == 0)
						{
							DeleteFolderFromBookmark(bm);
							ShowBookmarkManager(g,l,p);
						}
						else
						{
							DeleteAddressFromFolder(bm,ad);
							OpenFolder(bm,g,l,p);
						}
					} else if(toupper(a[0]) == 'N') {
						OpenBookmarkAddress(bm,ad,g,l,p);
					}
				} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));

			} else if(num == 3) {
				CreateNewFolder(bm);
				OpenFolder(bm,g,l,p);
			} else if(num == 4) {
				system("cls");
				ShowCurrentTab(g,l,p);
				cout<<"--------------------------------\n";
				ShowCurrentBookmark(bm,ad);
				MoveToAvailFolder_Address(bm,ad);
				ShowBookmarkManager(g,l,p);
			} else {
				ShowBookmarkManager(g,l,p);
			}
		} else {
			cout<<"\n[3]. Add this Bookmark address to new Folder";
			cout<<"\n[4]. Back\n";
			InputNumber(num, 1,4);

			if(num == 1) {
				AccessWebsite(g,l,p,ad.address);
			} else if(num == 2) {
				string a;
				do {
					cout<<" => Delete this Bookmark address? (Y/N): ";
					cin>>a;
					if(toupper(a[0]) == 'Y') {
						if(bm.nBM == 0)
						{
							DeleteFolderFromBookmark(bm);
							ShowBookmarkManager(g,l,p);
						}
						else
						{
							DeleteAddressFromFolder(bm,ad);
							OpenFolder(bm,g,l,p);
						}
					} else if(toupper(a[0]) == 'N') {
						OpenBookmarkAddress(bm,ad,g,l,p);
					}
				} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));
			} else if(num == 3) {
				CreateNewFolder(bm);
				OpenFolder(bm,g,l,p);
			} else {
				ShowBookmarkManager(g,l,p);
			}
		}
	} else {
		cout<<"\n[3]. Move this Bookmark address to available Folder";
		cout<<"\n[4]. Move this Bookmark address out of Folder";
		cout<<"\n[5]. Back\n";
		InputNumber(num, 1,5);

		if(num == 1) {
			AccessWebsite(g,l,p,ad.address);
		} else if(num == 2) {
			string a;
			do {
				cout<<" => Delete this Bookmark address? (Y/N): ";
				cin>>a;
				if(toupper(a[0]) == 'Y') {
					if(bm.nBM == 0)
					{
						DeleteFolderFromBookmark(bm);
						ShowBookmarkManager(g,l,p);
					}
					else
					{
						DeleteAddressFromFolder(bm,ad);
						OpenFolder(bm,g,l,p);
					}
				} else if(toupper(a[0]) == 'N') {
					OpenBookmarkAddress(bm,ad,g,l,p);
				}
			} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));
		} else if(num == 5) {
			OpenFolder(bm,g,l,p);
		}

		if(bm.nBM == 0) {
			if(num == 3) {
				system("cls");
				ShowCurrentTab(g,l,p);
				cout<<"--------------------------------\n";
				ShowCurrentBookmark(bm,ad);
				MoveToAvailFolder_Address(bm,ad);
				ShowBookmarkManager(g,l,p);
			} else {
				UnFolder(bm);
				ShowBookmarkManager(g,l,p);
			}
		} else {
			if(num == 3) {
				system("cls");
				ShowCurrentTab(g,l,p);
				cout<<"--------------------------------\n";
				ShowCurrentBookmark(bm,ad);
				MoveToAvailFolder_Folder(bm,ad);
				ShowBookmarkManager(g,l,p);
			} else {
				MoveAddressOutOfFolder(bm,ad);
				ShowBookmarkManager(g,l,p);
			}
		}
	}
}

void ShowFolderList(int &dem, int vt[]) {
	cout<<"\n\t[Folder List]\n";
	for(int i = 0; i<= nBM; i++) {
		if(IsFolder(bookmark[i])) {
			dem++;
			vt[dem]=i;
			printf("[%d]. ",dem);
			cout<<"[FOLDER] "<<bookmark[i].foldername<<endl;
		}
	}
}

void OpenFolder(Bookmark &bm, TabGroup &g, LLIST &l, Node *p) {
	system("cls");
	ShowCurrentTab(g,l,p);
	cout<<"--------------------------------\n";
	printf("[FOLDER] [P%d]. ",bm.pos+1);
	cout<<bm.foldername<<endl;

	for(int i= 0; i<=bm.nBM; i++) {
		printf("[%d]. ",i+1);
		cout<<bm.address[i].address<<endl;
	}

	if(p->address == "New Tab")
	{
		int o1 = bm.nBM + 2;
		int o2 = o1 + 1;
		int o3 = o2 + 1;
		int o4 = o3 + 1;
	
		printf("\n[%d]. ",o1);
		cout<<"Change Folder Name\n";
	
		printf("[%d]. ",o2);
		cout<<"Unfolder\n";
	
		printf("[%d]. ",o3);
		cout<<"Delete Folder\n";
	
		printf("[%d]. ",o4);
		cout<<"Back\n";
	
		int num;
		InputNumber(num,1,o4);
	
		if(num == o1) {
			string a;
			cout<<" => Now enter a new folder name: ";
			cin>>a;
			bm.foldername = a;
			Bookmark_WriteDataToFile();
			OpenFolder(bm,g,l,p);
		} else if(num == o2) {
			UnFolder(bm);
			while(bm.nBM > 0) {
				BookmarkThisTab(bm.address[bm.nBM].address);
				DeleteAddressFromFolder(bm, bm.address[bm.nBM]);
			}
			ShowBookmarkManager(g,l,p);
		} else if(num == o3) {
			string a;
			do {
				cout<<" => Delete this Folder? (Y/N): ";
				cin>>a;
				if(toupper(a[0]) == 'Y') {
					DeleteFolderFromBookmark(bm);
					ShowBookmarkManager(g,l,p);
				} else if(toupper(a[0]) == 'N') {
					OpenFolder(bm,g,l,p);
				}
			} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));
	
		} else if(num == o4) {
			ShowBookmarkManager(g,l,p);
		} else {
			OpenBookmarkAddress(bm,bm.address[num-1],g,l,p);
		}
	}
	else
	{
		int o1 = bm.nBM + 2;
		int o2 = o1 + 1;
		int o3 = o2 + 1;
		int o4 = o3 + 1;
		int o5 = o4 + 1;
	
		printf("\n[%d]. ",o1);
		cout<<"Bookmark current Tab to this Folder\n";
	
		printf("[%d]. ",o2);
		cout<<"Change Folder Name\n";
	
		printf("[%d]. ",o3);
		cout<<"Unfolder\n";
	
		printf("[%d]. ",o4);
		cout<<"Delete Folder\n";
	
		printf("[%d]. ",o5);
		cout<<"Back\n";
	
		int num;
		InputNumber(num,1,o5);
	
		if(num == o1) {
			AddAddressToFolder(bm,p->address);
			OpenFolder(bm,g,l,p);
		} else if(num == o2) {
			string a;
			cout<<" => Now enter a new folder name: ";
			cin>>a;
			bm.foldername = a;
			Bookmark_WriteDataToFile();
			OpenFolder(bm,g,l,p);
		} else if(num == o3) {
			UnFolder(bm);
			while(bm.nBM > 0) {
				BookmarkThisTab(bm.address[bm.nBM].address);
				DeleteAddressFromFolder(bm, bm.address[bm.nBM]);
			}
			ShowBookmarkManager(g,l,p);
		} else if(num == o4) {
			string a;
			do {
				cout<<" => Delete this Folder? (Y/N): ";
				cin>>a;
				if(toupper(a[0]) == 'Y') {
					DeleteFolderFromBookmark(bm);
					ShowBookmarkManager(g,l,p);
				} else if(toupper(a[0]) == 'N') {
					OpenFolder(bm,g,l,p);
				}
			} while(sizeof(a) > 1 && !(toupper(a[0]) == 'N' || toupper(a[0]) == 'Y'));
	
		} else if(num == o5) {
			ShowBookmarkManager(g,l,p);
		} else {
			OpenBookmarkAddress(bm,bm.address[num-1],g,l,p);
		}	
	}
}

void BookmarkThisTab(string address) {
	Bookmark bm;
	InitBookmark(bm);

	AddAddressToFolder(bm,address);
	AddFolderToBookmark(bm);
}

void ShowBookmarkManager(TabGroup &g, LLIST &l, Node *p) {
	int num;
	system("cls");
	ShowCurrentTab(g,l,p);

	cout<<"\n\t[Bookmark Manager]\n";

	if(p->address == "New Tab")
	{
		if(nBM >= 0) {
			for(int i=0; i<=nBM; i++) {
				printf("[%d]. ",i+1);
				if(IsFolder(bookmark[i]))
					cout<<"[FOLDER] "<<bookmark[i].foldername<<endl;
				else
					cout<<bookmark[i].address[0].address<<endl;
			}
	
			int o1 = nBM+2;
	
			printf("\n[%d]. Back\n",o1);
	
			InputNumber(num, 1, o1);
	
			if(num == o1) {
				ShowBookmark(g,l,p);
			} else {
				if(IsFolder(bookmark[num-1]))
					OpenFolder(bookmark[num-1],g,l,p);
				else
					OpenBookmarkAddress(bookmark[num-1],bookmark[num-1].address[0],g,l,p);
			}
		} else {
			cout<<"\n\tNo Bookmark\n";
			printf("\n[1]. Back\n");
			InputNumber(num,1,1);
			ShowBookmark(g,l,p);
		}
	}
	else
	{
		if(nBM >= 0) {
			for(int i=0; i<=nBM; i++) {
				printf("[%d]. ",i+1);
				if(IsFolder(bookmark[i]))
					cout<<"[FOLDER] "<<bookmark[i].foldername<<endl;
				else
					cout<<bookmark[i].address[0].address<<endl;
			}
	
			int o1 = nBM+2;
			int o2 = o1+1;
	
			printf("\n[%d]. Bookmark current Tab",o1);
			printf("\n[%d]. Back\n",o2);
	
			InputNumber(num, 1, o2);
	
			if(num == o1) {
				BookmarkThisTab(p->address);
				ShowBookmarkManager(g,l,p);
			} else if(num == o2) {
				ShowBookmark(g,l,p);
			} else {
				if(IsFolder(bookmark[num-1]))
					OpenFolder(bookmark[num-1],g,l,p);
				else
					OpenBookmarkAddress(bookmark[num-1],bookmark[num-1].address[0],g,l,p);
			}
		} else {
			cout<<"\n\tNo Bookmark\n";
			printf("\n[1]. Back\n");
			InputNumber(num,1,1);
			ShowBookmark(g,l,p);
		}
	}
}

void ShowBookmark(TabGroup &g, LLIST &l, Node *p) {
	int num;
	system("cls");
	ShowCurrentTab(g,l,p);

	cout<<"\n\t[Bookmark Controller]";

	if(p->address == "New Tab") {
		printf("\n[1]. Show Bookmark Manager");
		printf("\n[2]. Back\n");
		int num;
		InputNumber(num, 1, 2);
		if(num == 1) {
			ShowBookmarkManager(g,l,p);
		} else
			ShowUnknownPage(g,l,p);
	} else {
		printf("\n[1]. Bookmark this Tab");
		printf("\n[2]. Show Bookmark Manager");
		printf("\n[3]. Back\n");
		int num;
		InputNumber(num, 1, 3);
		if(num == 1) {
			BookmarkThisTab(p->address);
			ShowUnknownPage(g,l,p);
		} else if(num == 2) {
			ShowBookmarkManager(g,l,p);
		} else
			ShowUnknownPage(g,l,p);
	}
}
