#include "Library.h"

//properties
string Service::getsID() {
	return this->sID;
}

void Service::setsID(string sID) {
	this->sID = sID;
}

string Service::getsName() {
	return this->sName;
}

void Service::setsName(string sName) {
	this->sName = sName;
}

string Service::getsType() {
	return this->sType;
}

void Service::setsType(string sType) {
	this->sType = sType;
}

int Service::getiAmount() {
	return this->iAmount;
}

void Service::setiAmount(int iAmount) {
	this->iAmount = iAmount;
}

double Service::getdPrice() {
	return this->dPrice;
}

void Service::setdPrice(double dPrice) {
	this->dPrice = dPrice;
}
//constructor
Service::Service() {
}

Service::Service(string sID, string sName, string sType, int iAmount, double dPrice) {
	this->sID = sID;
	this->sName = sName;
	this->sType = sType;
	this->iAmount = iAmount;
	this->dPrice = dPrice;
}

//methods
//Input
void Service::InputName() {
	printf("Service Name: ");
	this->sName = InputString();
}

void Service::InputType() {
	cout << "Type Of Service ([0] Food - [1] Drink): " << endl;
	int tp = InputNumber(0, 1);
	switch (tp) {
	case 0: {
		this->sType = "Food";
		break;
	}
	case 1: {
		this->sType = "Drink";
		break;
	}
	}
}

void Service::InputAmount() {
	printf("Amount: ");
	this->iAmount = InputNumber_Int();
}

void Service::InputPrice() {
	printf("Price (VND): ");
	this->dPrice = InputNumber_Double();
}

//output
int Service::FindPadRight() {
	int max = 1;
	while (this->sID.length() > max
		|| this->sName.length() > max
		|| this->sType.length() > max
		|| to_string(this->iAmount).length() > max
		|| to_string(this->dPrice).length() > max
		) {
		max++;
	}
	return max;
}

int PadRightMaxService() {
	int len = lServices.at(0).FindPadRight();
	for (int i = 1; i < lServices.size(); i++) {
		if (lServices.at(i).FindPadRight() > len)
			len = lServices.at(i).FindPadRight();
	}
	return len + 10;
}

void Service::Output() {
	cout << setw(PadRightMaxService()) <<
		this->sID << setw(PadRightMaxService()) <<
		this->sName << setw(PadRightMaxService()) <<
		this->sType << setw(PadRightMaxService()) <<
		to_string(this->iAmount) << setw(PadRightMaxService()) <<
		to_string(this->dPrice) << endl;
}

void OutputServiceFields() {
	cout << endl;
	cout << setw(PadRightMaxService()) <<
		"[ID]" << setw(PadRightMaxService()) <<
		"[NAME]" << setw(PadRightMaxService()) <<
		"[TYPE]" << setw(PadRightMaxService()) <<
		"[AMOUNT]" << setw(PadRightMaxService()) <<
		"[PRICE]" << endl;
}

void Service::Input() {
	if (lServices.size() == 0)
		this->sID += "0";
	else
		this->sID += to_string(FindMaxServiceID() + 1);
	cout << "Current Service ID: " << this->sID << endl;
	InputName();
	InputType();
	InputAmount();
	InputPrice();
}

int FindMaxServiceID() {
	int id = 0;
	for (int i = 0; i < lServices.size(); i++) {
		if (stoi(lServices.at(i).getsID().substr(2)) > id)
			id = stoi(lServices.at(i).getsID().substr(2));
	}
	return id;
}

//Methods SORT
void SortServiceID() {
	for (int i = 0; i < lServices.size() - 1; i++) {
		for (int j = i + 1; j < lServices.size(); j++) {
			if (lServices.at(i).getsID() > lServices.at(j).getsID()) {
				Service tmp = lServices.at(i);
				lServices.at(i) = lServices.at(j);
				lServices.at(j) = tmp;
			}
		}
	}
}

void SortServiceType() {
	for (int i = 0; i < lServices.size() - 1; i++) {
		for (int j = i + 1; j < lServices.size(); j++) {
			if (lServices.at(i).getsType() > lServices.at(j).getsType()) {
				Service tmp = lServices.at(i);
				lServices.at(i) = lServices.at(j);
				lServices.at(j) = tmp;
			}
		}
	}
}

void SortServiceName() {
	for (int i = 0; i < lServices.size() - 1; i++) {
		for (int j = i + 1; j < lServices.size(); j++) {
			if (lServices.at(i).getsName() > lServices.at(j).getsName()) {
				Service tmp = lServices.at(i);
				lServices.at(i) = lServices.at(j);
				lServices.at(j) = tmp;
			}
		}
	}
}

void SortServiceAmount() {
	for (int i = 0; i < lServices.size() - 1; i++) {
		for (int j = i + 1; j < lServices.size(); j++) {
			if (lServices.at(i).getiAmount() > lServices.at(j).getiAmount()) {
				Service tmp = lServices.at(i);
				lServices.at(i) = lServices.at(j);
				lServices.at(j) = tmp;
			}
		}
	}
}

void SortServicePrice() {
	for (int i = 0; i < lServices.size() - 1; i++) {
		for (int j = i + 1; j < lServices.size(); j++) {
			if (lServices.at(i).getdPrice() > lServices.at(j).getdPrice()) {
				Service tmp = lServices.at(i);
				lServices.at(i) = lServices.at(j);
				lServices.at(j) = tmp;
			}
		}
	}
}

//Login_Methods
int SearchService(string id) {
	id = toLower(id);
	for (int i = 0; i < lServices.size(); i++) {
		if (toLower(lServices.at(i).getsID()) == id) {
			return i;
		}
	}
	return -1;
}

void AddNewService() {
	cout << "\n\t[ADDING NEW SERVICE]\n";
	Service sv;
	sv.Input();
	lServices.push_back(sv);
}

int SelectService() {
	string id;
	int pos;
	do {
		try {

			printf(" => Now Enter Service ID: ");
			getline(cin, id);
			pos = SearchService(id);
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

void ResetServiceID() {
	for (int i = 0; i < lServices.size(); i++) {
		lServices.at(i).setsID("SV" + to_string(i));
	}
}

//Methods FILES
void WriteDataService() {

	string wt[MAX];

	for (int i = 0; i < lServices.size(); i++) {
		wt[i] = lServices.at(i).getsID() + ";"
			+ lServices.at(i).getsName() + ";"
			+ lServices.at(i).getsType() + ";"
			+ to_string(lServices.at(i).getiAmount()) + ";"
			+ to_string(lServices.at(i).getdPrice());
	}

	fstream fileout("Service.txt", ios_base::out);
	for (int i = 0; i < lServices.size(); i++) {
		fileout << wt[i];
		if (i < lServices.size() - 1)
			fileout << endl;
	}
	fileout.close();
}

void ReadDataService() {
	fstream filein("Service.txt", std::ios_base::in);

	while (!filein.eof()) {
		string line[MAX];
		string tmp;
		int dem = 0;
		Service sv;

		getline(filein, tmp);
		if (tmp == "")
		{
			filein.close();
			return;
		}
		dem = SplitString(line, tmp, ';');

		sv.setsID(line[0]);
		sv.setsName(line[1]);
		sv.setsType(line[2]);
		sv.setiAmount(stoi(line[3]));
		sv.setdPrice(stod(line[4]));

		lServices.push_back(sv);
	}
	filein.close();
}