#include "Library.h"

string Staff::getsID() {
	return sID;
}

void Staff::setsID(string sID) {
	this->sID = sID;
}

string Staff::getsName() {
	return sName;
}

void Staff::setsName(string sName) {
	this->sName = sName;
}

string Staff::getsIDCard() {
	return sIDCard;
}

void Staff::setsIDCard(string sIDCard) {
	this->sIDCard = sIDCard;
}

string Staff::getsSex() {
	return sSex;
}

void Staff::setsSex(string sSex) {
	this->sSex = sSex;
}

Date Staff::getdBirth() {
	return dBirth;
}

void Staff::setdBirth(Date dBirth) {
	this->dBirth = dBirth;
}

string Staff::getsPhoneNumber() {
	return sPhoneNumber;
}

void Staff::setsPhoneNumber(string sPhoneNumber) {
	this->sPhoneNumber = sPhoneNumber;
}

string Staff::getsAddress() {
	return sAddress;
}

void Staff::setsAddress(string sAddress) {
	this->sAddress = sAddress;
}

string Staff::getsType() {
	return sType;
}

void Staff::setsType(string sType) {
	this->sType = sType;
}

Account Staff::getaAccount() {
	return aAccount;
}

void Staff::setaAccount(Account aAccount) {
	this->aAccount = aAccount;
}

//Contrustors
Staff::Staff() {}
Staff::~Staff() {}

Staff::Staff(string sID, string sName, string sIDCard, string sSex, Date dBirth, string sPhoneNumber, string sAddress, string sType, Account aAccount) {
	this->sID = sID;
	this->sName = sName;
	this->sIDCard = sIDCard;
	this->sSex = sSex;
	this->dBirth = dBirth;
	this->sPhoneNumber = sPhoneNumber;
	this->sAddress = sAddress;
	this->sType = sType;
	this->aAccount = aAccount;
}

//input
void Staff::InputName() {
	printf("Staff Name: ");
	this->setsName(InputString());
}

void Staff::InputIDCard() {
	printf("ID Card Number: ");
	this->setsIDCard(InputString());
}

void Staff::InputSex() {
	printf("Gender ([0] Male - [1] Female): \n");
	int tp = InputNumber(0, 1);
	switch (tp) {
	case 0: this->setsSex("Male");
	case 1: this->setsSex("Female");
	}
}

void Staff::InputBirth() {
	printf("Birth Of ");
	this->dBirth.Input();
}

void Staff::InputPhoneNumber() {
	printf("Phone Number: ");
	this->setsPhoneNumber(InputString());
}

void Staff::InputAddress() {
	printf("Address: ");
	this->setsAddress(InputString());
}

int StaffCount() {
	int dem = 0;
	for (int i = 0; i < lStaffs.size(); i++) {
		if (lStaffs.at(i).getsType() == "Staff")
			dem++;
	}
	return dem;
}

int FindMaxStaffID() {
	int id = 0;
	for (int i = 0; i < lStaffs.size(); i++) {
		if ((lStaffs.at(i).getsType() == "Staff") && stoi(lStaffs.at(i).getsID().substr(2)) > id)
			id = stoi(lStaffs.at(i).getsID().substr(2));
	}
	return id;
}

void Staff::Input() {
	this->sID = "ST";
	if (StaffCount() == 0)
		this->sID += "0";
	else
		this->sID += to_string(FindMaxStaffID() + 1);
	cout << "Current Staff ID: " << this->sID << endl;
	InputName();
	InputIDCard();
	InputSex();
	InputBirth();
	InputPhoneNumber();
	InputAddress();
	Account ac;
	ac.AddAccount();
	this->setaAccount(ac);
	this->setsType("Staff");
}

//Output
int Staff::FindPadRight() {
	int max = 1;
	while (this->sID.length() > max
		|| this->sName.length() > max
		|| this->sIDCard.length() > max
		|| this->sSex.length() > max
		|| ToString(this->dBirth).length() > max
		|| this->sPhoneNumber.length() > max
		|| this->sAddress.length() > max
		|| this->sType.length() > max
		|| this->aAccount.getsUsername().length() > max
		|| this->aAccount.getsPassword().length() > max) {
		max++;
	}
	return max;
}

int PadRightMaxStaff() {
	int len = lStaffs.at(0).FindPadRight();
	for (int i = 1; i < lStaffs.size(); i++) {
		if (lStaffs.at(i).FindPadRight() > len)
			len = lStaffs.at(i).FindPadRight();
	}
	return len + 2;
}

void Staff::Output() {
	cout << setw(PadRightMaxStaff()) <<
		this->sID << setw(PadRightMaxStaff()) <<
		this->sName << setw(PadRightMaxStaff()) <<
		this->sIDCard << setw(PadRightMaxStaff()) <<
		this->sSex << setw(PadRightMaxStaff()) <<
		ToString(this->dBirth) << setw(PadRightMaxStaff()) <<
		this->sPhoneNumber << setw(PadRightMaxStaff()) <<
		this->sAddress << setw(PadRightMaxStaff()) <<
		this->sType << setw(PadRightMaxStaff()) <<
		this->aAccount.getsUsername() << setw(PadRightMaxStaff()) <<
		this->aAccount.getsPassword() << endl;
}

void SortStaffType() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsType() > lStaffs.at(j).getsType()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffID() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsID() > lStaffs.at(j).getsID()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffName() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsName() > lStaffs.at(j).getsName()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffIDCard() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsIDCard() > lStaffs.at(j).getsIDCard()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffSex() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsSex() > lStaffs.at(j).getsSex()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffPhoneNumber() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsPhoneNumber() > lStaffs.at(j).getsPhoneNumber()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffAddress() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (lStaffs.at(i).getsAddress() > lStaffs.at(j).getsAddress()) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

void SortStaffBirth() {
	for (int i = 0; i < lStaffs.size() - 1; i++) {
		for (int j = i + 1; j < lStaffs.size(); j++) {
			if (IsMore(lStaffs.at(i).getdBirth(), lStaffs.at(j).getdBirth())) {
				Staff tmp = lStaffs.at(i);
				lStaffs.at(i) = lStaffs.at(j);
				lStaffs.at(j) = tmp;
			}
		}
	}
}

//Methods
int SelectStaff() {
	string id;
	int pos;
	do {
		try {
			printf(" => Now Enter Staff ID: ");
			getline(cin, id);
			pos = SearchStaff(id);
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

void AddNewStaff() {
	printf("\n\t[ADDING NEW STAFF]\n\n");
	Staff sv;
	sv.Input();
	lStaffs.push_back(sv);
}

void OutputStaffFields() {
	cout << endl;
	cout << setw(PadRightMaxStaff()) <<
		"[ID]" << setw(PadRightMaxStaff()) <<
		"[NAME]" << setw(PadRightMaxStaff()) <<
		"[ID CARD]" << setw(PadRightMaxStaff()) <<
		"[SEX]" << setw(PadRightMaxStaff()) <<
		"[BIRTH]" << setw(PadRightMaxStaff()) <<
		"[PHONE]" << setw(PadRightMaxStaff()) <<
		"[ADDRESS]" << setw(PadRightMaxStaff()) <<
		"[TYPE]" << setw(PadRightMaxStaff()) <<
		"[USERNAME]" << setw(PadRightMaxStaff()) <<
		"[PASSWORD]" << setw(PadRightMaxStaff()) << endl;
}

void ResetStaffID() {
	int dem = 0;
	for (int i = 0; i < lStaffs.size(); i++) {
		if (lStaffs.at(i).getsType() == "Staff") {
			lStaffs.at(i).setsID("ST" + to_string(dem));
			dem++;
		}
	}
}

int SearchStaff(string id) {
	for (int i = 0; i < lStaffs.size(); i++) {
		if (toLower(lStaffs.at(i).getsID()) == toLower(id)) {
			return i;
		}
	}
	return -1;
}

//FILES
void WriteDataStaff() {

	fstream output;
	output.open("Staff.txt", ios::out);

	string wt[MAX];
	for (int i = 0; i < lStaffs.size(); i++) {
		wt[i] = lStaffs.at(i).getsID() +
			";" + lStaffs.at(i).getsName() +
			";" + lStaffs.at(i).getsIDCard() +
			";" + lStaffs.at(i).getsSex() +
			";" + ToString(lStaffs.at(i).getdBirth()) +
			";" + lStaffs.at(i).getsPhoneNumber() +
			";" + lStaffs.at(i).getsAddress() +
			";" + lStaffs.at(i).getsType() +
			";" + lStaffs.at(i).getaAccount().getsUsername() +
			";" + lStaffs.at(i).getaAccount().getsPassword();
	}

	for (int i = 0; i < lStaffs.size(); i++)
	{
		output << wt[i];
		if (i < lStaffs.size() - 1)
			output << endl;
	}
	output.close();
}

void ReadDataStaff() {
	fstream filein("Staff.txt", ios_base::in);

	while (!filein.eof()) {
		string line[MAX];
		string tmp;
		int dem = 0;

		getline(filein, tmp);
		if (tmp == "")
		{
			filein.close();
			return;
		}
		dem = SplitString(line, tmp, ';');
		Staff st;
		st.setsID(line[0]);
		st.setsName(line[1]);
		st.setsIDCard(line[2]);
		st.setsSex(line[3]);
		st.setdBirth(ToDate(line[4]));
		st.setsPhoneNumber(line[5]);
		st.setsAddress(line[6]);
		st.setsType(line[7]);
		Account ac;
		ac.setsUsername(line[8]);
		ac.setsPassword(line[9]);
		st.setaAccount(ac);
		lStaffs.push_back(st);
	}
	filein.close();
}