#include"Prototype.h"

int nTL;
TabGroup tablist[MAX];

int nH;
History history[MAX];

Stack closedtab;

int nBM;
Bookmark bookmark[MAX];

int main(int argc, char** argv) {
	
	nTL = -1;
	nH = -1;
	nBM = -1;
	InitStack(closedtab);
	History_ReadDataFromFile();
	Bookmark_ReadDataFromFile();
	OpenNewTab();
	return 0;
}
