#include<bits/stdc++.h>
#include<iostream>
#include<stdio.h>
#include<cstdlib>
#include<cstring>
#include<fstream>
#define MAX 100
using namespace std;

//Structs
struct Node {
	string address;
	Node *next;
	Node *back;
};

struct LLIST {
	int pos;
	Node *present;
	Node *head;
	Node *tail;
};

struct TabGroup {
	int pos;
	int nTG;
	string groupname;
	LLIST tabgroup[MAX];
};

struct Stack {
	TabGroup arr[MAX];
	int top;
};

struct History {
	int pos;
	string address;
};

struct Bookmark{
	int pos;
	int nBM;
	string foldername;
	History address[MAX];
};

//Global Variables
extern int nTL;
extern TabGroup tablist[MAX];

extern int nH;
extern History history[MAX];

extern Stack closedtab;

extern int nBM;
extern Bookmark bookmark[MAX];

//STACK Prototypes
void InitStack(Stack &A);
bool StackIsFull(Stack A);
bool StackIsEmpty(Stack A);
void Push(Stack &A, TabGroup g);
TabGroup Pop(Stack &A);

//DOUBLY LINKED LIST Prototypes
bool ListIsEmpty(LLIST l);
void InitList(LLIST &l);
void AddHead(LLIST &l, Node *p);
void AddTail(LLIST &l, Node *p);
void DeleteHead(LLIST &l);
void DeleteTail(LLIST &l);
void DeleteAfterQ(LLIST &l, Node*q);
void DeleteList(LLIST &l);
Node *CreateNode(string a);

//TAB
void OpenNewTab();
void CloseThisTab(TabGroup &g, LLIST &l, Node *p);

//GROUP
void InitTabGroup(TabGroup &g);
bool IsGroup(TabGroup g);
void UnGroup(TabGroup &g);
bool GroupIsFull(TabGroup g);
void CreateNewGroup(TabGroup &g);
void DeleteGroup(TabGroup &g);
int GroupCount();
void ShowGroupList(int &dem, int vt[]);
void CloseGroup(TabGroup &g);
void OpenGroup(TabGroup &g);

//Tab Methods
void ListAssignValue(LLIST &a, LLIST b);
void GroupAssignValue(TabGroup &a, TabGroup b);
void AddTabToGroup(TabGroup &g, LLIST l);
void AddGroupToTabList(TabGroup g);
void DeleteTabFromGroup(TabGroup &g, LLIST l);
void DeleteGroupFromTabList(TabGroup g);

//Add this tab to Group
void ShowCurrentTab(TabGroup g, LLIST l, Node *p);
void AddThisTabToAvailableGroup(TabGroup &g, LLIST &l, Node *p);
void MoveThisTabOutOfGroup(TabGroup &g, LLIST l);
void AddThisTabToGroup(TabGroup &g, LLIST &l, Node *p);

//Number Processing
void InputNumber(int &num, int dau, int cuoi);
void AccessWebsite(TabGroup &g, LLIST &l, Node *p, string a);
void Exit();
void NumberProcess(TabGroup &g, LLIST &l, Node *p, int num);
void NewTab_NumberProcess(TabGroup &g, LLIST &l, Node *p, int num);
void NextPage_NumberProcess(TabGroup &g, LLIST &l, Node *p, int num);

//Show Tab List
bool AddOpenClosedTab(int &lastnum);
void ShowTabList();

//Showing Methods DISPLAY OUTPUT
void ShowUnknownPage(TabGroup &g, LLIST &l, Node *p);
void Show(LLIST &l, Node *p, int &lastnum);
void AddNext(Node *p, int &lastnum);
void ShowTab(TabGroup &g, LLIST &l, Node *p);
void ShowPage(TabGroup &g, LLIST &l, Node *p);

//History
void AddHistory(string a);
void DeleteHistory(int pos);
void OpenHistoryTab();
void ShowHistory(TabGroup &g, LLIST &l, Node *p);
void ShowHistoryOption(TabGroup &g, LLIST &l, Node *p, int pos);
void SearchHistory(TabGroup &g, LLIST &l, Node *p);

//File methods
void History_ReadDataFromFile();
void History_WriteDataToFile();
void Bookmark_ReadDataFromFile();
void Bookmark_WriteDataToFile();

//BOOKMARKS
void InitBookmark(Bookmark &a);
void UnFolder(Bookmark &bm);
void BookmarkAssignValue(Bookmark &a, Bookmark b);
void AddAddressToFolder(Bookmark &bm, string address);
void AddFolderToBookmark(Bookmark bm);
void DeleteAddressFromFolder(Bookmark &bm, History a);
void DeleteFolderFromBookmark(Bookmark bm);
void CreateNewFolder(Bookmark &bm);
bool IsFolder(Bookmark a);
void ShowCurrentBookmark(Bookmark bm, History ad);
int FolderCount();
void MoveToAvailFolder_Address(Bookmark bm, History ad);
void MoveToAvailFolder_Folder(Bookmark &bm, History ad);
void MoveAddressOutOfFolder(Bookmark &bm, History ad);
void OpenBookmarkAddress(Bookmark &bm, History &ad, TabGroup &g, LLIST &l, Node *p);
void ShowFolderList(int &dem, int vt[]);
void OpenFolder(Bookmark &bm, TabGroup &g, LLIST &l, Node *p);
void BookmarkThisTab(string address);
void ShowBookmarkManager(TabGroup &g, LLIST &l, Node *p);
void ShowBookmark(TabGroup &g, LLIST &l, Node *p);
