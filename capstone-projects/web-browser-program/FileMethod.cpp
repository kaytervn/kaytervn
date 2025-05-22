#include"Prototype.h"

void History_ReadDataFromFile() {
	fstream input;
	input.open("HISTORY.txt", ios::in);

	if(input!= NULL) {
		while(!input.eof()) {
			string tmp;
			input>>tmp;
			if(tmp != "") {
				nH++;
				history[nH].address = tmp;
				history[nH].pos = nH;
			}
		}
		input.close();
	} else {
		system("cls");
		cout<<"Failed to open HISTORY file!";
		exit(0);
	}
}

void History_WriteDataToFile() {
	fstream output;
	output.open("HISTORY.txt", ios::out);

	if(output) {
		if(nH == -1)
			output<<"\0";
		else
			for(int i=0; i<=nH; i++) {
				output<<history[i].address;
				if(i < nH)
					output<<endl;
			}
		output.close();
	} else {
		system("cls");
		cout<<"Failed to open HISTORY file!";
		exit(0);
	}
}

//BOOKMARKS
void Bookmark_ReadDataFromFile() {
	fstream input;
	input.open("BOOKMARK.txt", ios::in);

	if(input!= NULL) {
		while(!input.eof()) {
			string tmp;
			input>>tmp;
			
			if(tmp != "\0")
			{
				if(tmp == "*N@Z3*")
				{
					nBM++;
					bookmark[nBM].foldername = "";
					bookmark[nBM].pos = nBM;
					
					string tmp2;
					input>>tmp2;
					bookmark[nBM].nBM = 0;
					bookmark[nBM].address[bookmark[nBM].nBM].address = tmp2;
					bookmark[nBM].address[bookmark[nBM].nBM].pos = 0;
				}
				else
				{
					nBM++;
					bookmark[nBM].foldername = tmp;
					bookmark[nBM].pos = nBM;
					
					input.ignore();
					string line;
					getline(input,line);
					
					stringstream ss(line);
					string w;
					
					bookmark[nBM].nBM = -1;
					
					while(ss >> w) {
						bookmark[nBM].nBM++;
						bookmark[nBM].address[bookmark[nBM].nBM].address = w;
						bookmark[nBM].address[bookmark[nBM].nBM].pos = bookmark[nBM].nBM;
					}
				}
			}
		}
		input.close();
	} else {
		system("cls");
		cout<<"Failed to open BOOKMARK file!";
		exit(0);
	}
}

void Bookmark_WriteDataToFile() {
	fstream output;
	output.open("BOOKMARK.txt", ios::out);

	if(output) {
		if(nBM == -1)
			output<<"\0";
		else
			for(int i=0; i<=nBM; i++) {
				if(bookmark[i].foldername == "")
					output<<"*N@Z3*"<<endl;
				else
					output<<bookmark[i].foldername<<endl;
				for(int j=0; j<= bookmark[i].nBM ; j++) {
					output<<bookmark[i].address[j].address;
					if(j < bookmark[i].nBM)
						output<<" ";
				}
				if(i < nBM)
					output<<endl;
			}
		output.close();
	} else {
		system("cls");
		cout<<"Failed to open BOOKMARK file!";
		exit(0);
	}
}
