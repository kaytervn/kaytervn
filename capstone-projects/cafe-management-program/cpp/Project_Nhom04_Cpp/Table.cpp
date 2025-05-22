#include "Library.h"

string Table::getsID() {
	return this->sID;
}

void Table::setsID(string sID) {
	this->sID = sID;
}

string Table::getsStatus() {
	return this->sStatus;
}

void Table::setsStatus(string sStatus) {
	this->sStatus = sStatus;
}

Table::Table() {
}

//Input
void Table::InputStatus() {
	printf("Status ([0] Empty - [1] Served): ");
	cout << endl;

	int st = InputNumber(0, 1);
	switch (st) {
	case 0:
		this->sStatus = "Empty";
		break;
	case 1:
		this->sStatus = "Served";
		break;
	}
}

void Table::Input() {
	if (lTables.size() == 0)
		this->sID += "0";
	else {
		this->sID += to_string(FindMaxTableID() + 1);
	}
	cout << "Current Table ID: " << this->sID << endl;
	InputStatus();
}

//Output
void Table::Output() {
	cout << setw(20) << this->getsID() << setw(20) << this->getsStatus() << endl;
}

int FindMaxTableID() {
	int id = 0;
	for (int i = 0; i < lTables.size(); i++) {
		if (stoi(lTables.at(i).getsID().substr(2)) > id)
			id = stoi(lTables.at(i).getsID().substr(2));
	}
	return id;
}

//Sort
void SortTableID() {
	for (int i = 0; i < lTables.size() - 1; i++) {
		for (int j = i + 1; j < lTables.size(); j++) {
			if (lTables.at(i).getsID() > lTables[j].getsID()) {
				Table tmp = lTables.at(i);
				lTables.at(i) = lTables[j];
				lTables[j] = tmp;
			}
		}
	}
}

void SortTableStatus() {
	for (int i = 0; i < lTables.size() - 1; i++) {
		for (int j = i + 1; j < lTables.size(); j++) {
			if (lTables.at(i).getsStatus() > lTables[j].getsStatus()) {
				Table tmp = lTables.at(i);
				lTables.at(i) = lTables[j];
				lTables[j] = tmp;
			}
		}
	}
}

//Methods
//Login_Methods
int SearchTable(string id) {
	id = toLower(id);
	for (int i = 0; i < lTables.size(); i++) {
		if (toLower(lTables.at(i).getsID()) == toLower(id)) {
			return i;
		}
	}
	return -1;
}

void AddNewTable() {
	printf("\n\t[ADDING NEW TABLE]\n");
	Table tb;
	tb.Input();
	lTables.push_back(tb);
}

int SelectTable() {
	string id;
	int pos;
	do {
		try {

			printf(" => Now Enter Table ID: ");
			getline(cin, id);
			pos = SearchTable(id);
			if (pos == -1)
				continue;
			else
				return pos;
		}
		catch (exception e) {
			continue;
		}
	} while (true);

}

void ResetTableID() {
	for (int i = 0; i < lTables.size(); i++) {
		lTables.at(i).setsID("TB" + to_string(i));
	}
}

//FILES
void WriteDataTable() {
	string wt[MAX];
	for (int i = 0; i < lTables.size(); i++) {
		wt[i] = lTables.at(i).getsID() + ";" + lTables.at(i).getsStatus();
		if (lTables.at(i).lOrder.size() > 0) {
			for (int j = 0; j < lTables.at(i).lOrder.size(); j++) {
				wt[i] += ";" + lTables.at(i).lOrder.at(j).getsServiceName()
					+ ";" + to_string(lTables.at(i).lOrder.at(j).getiAmount())
					+ ";" + to_string(lTables.at(i).lOrder.at(j).getdPrice())
					+ ";" + to_string(lTables.at(i).lOrder.at(j).getdCost());
			}
		}
	}
	fstream fileout("Table.txt", std::ios_base::out);
	for (int i = 0; i < lTables.size(); i++) {
		fileout << wt[i];
		if (i < lTables.size() - 1)
			fileout << endl;
	}
	fileout.close();
}

void ReadDataTable() {
	fstream filein("Table.txt", std::ios_base::in);

	while (!filein.eof()) {
		string line[MAX];
		string tmp;
		int dem = 0;
		Table tb;

		getline(filein, tmp);
		if (tmp == "")
		{
			filein.close();
			return;
		}

		dem = SplitString(line, tmp, ';');

		tb.setsID(line[0]);
		tb.setsStatus(line[1]);

		if (dem > 1)
		{
			for (int i = 2; i <= dem; i += 4)
			{
				Order od;
				od.setsServiceName(line[i]);
				od.setiAmount(stoi(line[i + 1]));
				od.setdPrice(stod(line[i + 2]));
				od.setdCost(stod(line[i + 3]));

				tb.lOrder.push_back(od);
			}
		}
		lTables.push_back(tb);
	}
	filein.close();
}